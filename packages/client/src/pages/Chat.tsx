import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConversations, getMessages, sendMessage, createGroupConversation } from '../api/chat';
import { getFriends } from '../api/friend';
import { getSmartReplies, getConversationSummary } from '../api/ai';
import { uploadFile } from '../api/upload';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../store/useAuthStore';
import { useCall } from '../context/CallContext';
import { Phone, Video, Bot, Paperclip, X, Send, Network, Smile, Mic, Search, Pin, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';

export const Chat = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups' | 'mentions'>('all');
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  
  const [summary, setSummary] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const socket = useSocket();
  const user = useAuthStore(state => state.user);
  const { initiateCall } = useCall();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeConversationId) {
      setActiveConversationId(location.state.activeConversationId);
    }
  }, [location.state]);

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: () => getMessages(activeConversationId!),
    enabled: !!activeConversationId,
  });

  useQuery({
    queryKey: ['smart-replies', activeConversationId, messages?.length],
    queryFn: () => getSmartReplies(activeConversationId!),
    enabled: !!activeConversationId && !!messages && messages.length > 0,
    staleTime: Infinity,
  });

  const { data: friends } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
    enabled: isCreatingGroup
  });

  const sendMsgMutation = useMutation({
    mutationFn: async (content: string) => {
      let finalContent = content;
      let type = 'text';
      let fileUrl = '';
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
        type = selectedFile.type.startsWith('image/') ? 'image' : 'file';
        if (!finalContent) finalContent = selectedFile.name;
      }
      return sendMessage(activeConversationId!, finalContent, type, fileUrl);
    },
    onSuccess: () => {
      setMessageText('');
      setSelectedFile(null);
      setFilePreview(null);
      setShowEmojiPicker(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: () => createGroupConversation(groupName, selectedFriends),
    onSuccess: (newConv) => {
      setIsCreatingGroup(false);
      setGroupName('');
      setSelectedFriends([]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveConversationId(newConv._id);
    }
  });

  useMutation({
    mutationFn: () => getConversationSummary(activeConversationId!),
    onSuccess: (data) => setSummary(data.summary)
  });

  useEffect(() => {
    if (!socket) return;
    if (activeConversationId) socket.emit('join_conversation', activeConversationId);

    const handleReceiveMessage = (message: any) => {
      queryClient.setQueryData(['messages', message.conversationId], (old: any) => {
        if (!old) return [message];
        if (old.find((m: any) => m._id === message._id)) return old;
        return [...old, message];
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      scrollToBottom();
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      if (activeConversationId) socket.emit('leave_conversation', activeConversationId);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeConversationId, queryClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversationId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((messageText.trim() || selectedFile) && activeConversationId) {
      sendMsgMutation.mutate(messageText);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessageText(prev => prev + emojiData.emoji);
  };

  const activeConvDetails = conversations?.find((c: any) => c._id === activeConversationId);
  const activeTitle = activeConvDetails?.type === 'direct' 
    ? activeConvDetails.participants.find((p:any) => p._id !== user?.id)?.username 
    : activeConvDetails?.groupMetadata?.name;

  return (
    <>
      {/* Secondary Sidebar (Conversations) */}
      <div className="w-[320px] flex flex-col bg-[#0B0F19] z-20 overflow-hidden border-r border-white/5 shrink-0">
        <div className="p-4 border-b border-white/5 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input className="bg-transparent border border-white/10 rounded-xl h-10 pl-9 focus:border-[#8B5CF6] text-white text-sm" placeholder="Search chats..." />
            </div>
            <button 
              onClick={() => setIsCreatingGroup(!isCreatingGroup)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 shrink-0"
            >
              {isCreatingGroup ? <X size={18} className="text-slate-300" /> : <Network size={18} className="text-slate-300" />}
            </button>
          </div>

          {/* Filter Tabs */}
          {!isCreatingGroup && (
            <div className="flex border-b border-white/5">
              {(['all', 'unread', 'groups', 'mentions'] as const).map(filter => (
                <button 
                  key={filter}
                  onClick={() => setChatFilter(filter)}
                  className={cn(
                    "flex-1 text-xs font-semibold py-2 capitalize transition-all relative text-center",
                    chatFilter === filter ? "text-[#8B5CF6]" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {filter}
                  {chatFilter === filter && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B5CF6] rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {isCreatingGroup ? (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 flex-1 overflow-y-auto">
            <h3 className="font-semibold text-white mb-3 px-2">Create AI Group</h3>
            <div className="px-2 mb-4">
              <Input 
                placeholder="Group Name" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-transparent border-white/10 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <div className="font-medium text-xs text-slate-500 mb-2 px-2 uppercase tracking-wider">Select Network Nodes</div>
            <ul className="space-y-2 mb-6">
              {friends?.map((friend: any) => {
                const isSelected = selectedFriends.includes(friend._id);
                return (
                  <li 
                    key={friend._id} 
                    onClick={() => toggleFriendSelection(friend._id)}
                    className={cn(
                      "p-3 rounded-2xl cursor-pointer border transition-all duration-300 flex items-center gap-3",
                      isSelected ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/50" : "bg-transparent border-transparent hover:bg-white/5"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shrink-0", isSelected ? "bg-[#8B5CF6] text-white" : "bg-[#1e293b] text-white")}>
                      {friend.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={cn("font-medium", isSelected ? "text-white" : "text-slate-300")}>{friend.username}</span>
                    {isSelected && <div className="ml-auto w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></div>}
                  </li>
                );
              })}
            </ul>
            <div className="px-2 mt-auto pb-4">
              <Button 
                onClick={() => createGroupMutation.mutate()}
                disabled={!groupName.trim() || selectedFriends.length === 0 || createGroupMutation.isPending}
                className="w-full rounded-xl bg-[#8B5CF6] hover:bg-[#7c4ce0] text-white font-bold h-12"
              >
                Initialize Group
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {conversations?.map((conv: any) => {
              const otherParticipant = conv.participants.find((p: any) => p._id !== user?.id) || conv.participants[0];
              const title = conv.type === 'direct' ? otherParticipant?.username : conv.groupMetadata?.name;
              const isActive = activeConversationId === conv._id;
              
              return (
                <div 
                  key={conv._id} 
                  onClick={() => setActiveConversationId(conv._id)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-300 relative",
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 relative",
                    isActive ? "bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] text-white" : "bg-[#1e293b] text-slate-300"
                  )}>
                    {title?.[0]?.toUpperCase() || 'U'}
                    {isActive && <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0B0F19]"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-semibold text-white truncate text-sm">{title}</div>
                      <span className="text-[10px] text-slate-500">10:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className={cn("text-xs truncate", isActive ? "text-[#8B5CF6]" : "text-slate-400")}>
                        {conv.lastMessageId?.content || 'Initiate link...'}
                      </div>
                      <div className="w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        2
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#050816] z-20 overflow-hidden relative">
        {activeConversationId && !isCreatingGroup ? (
          <>
            {/* Header */}
            <div className="h-[80px] px-6 border-b border-white/5 bg-[#050816] flex items-center justify-between z-20 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-bold shrink-0">
                  {activeTitle?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight tracking-tight text-white">{activeTitle}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <p className="text-[11px] text-green-500 font-medium">Online</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Search size={18} />
                </button>
                <button 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => activeConvDetails?.type === 'direct' && initiateCall(activeConvDetails.participants.find((p:any) => p._id !== user?.id)?._id, 'audio')}
                >
                  <Phone size={18} />
                </button>
                <button 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => activeConvDetails?.type === 'direct' && initiateCall(activeConvDetails.participants.find((p:any) => p._id !== user?.id)?._id, 'video')}
                >
                  <Video size={18} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Pinned Message Banner */}
            <div className="px-6 py-2 border-b border-white/5 bg-[#8B5CF6]/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <Pin size={14} className="text-[#8B5CF6]" />
                <div>
                  <span className="text-[#8B5CF6] font-semibold mr-2">Pinned Message</span>
                  <span className="text-slate-300">Please review the latest design system updates.</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white"><X size={14} /></button>
            </div>

            {/* AI Summary Banner */}
            <AnimatePresence>
              {summary && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#8B5CF6]/10 border-b border-[#8B5CF6]/20 overflow-hidden relative"
                >
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#8B5CF6] text-sm mb-1">AI Analysis</h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">{summary}</p>
                      </div>
                    </div>
                    <button onClick={() => setSummary(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors shrink-0">
                      <X size={16} className="text-slate-400" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ backgroundColor: '#050816', backgroundBlendMode: 'overlay' }}>
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-slate-400">Today</span>
              </div>
              
              {messages?.map((msg: any) => {
                const isMine = msg.senderId._id === user?.id;
                const isImage = msg.type === 'image';
                const isFile = msg.type === 'file';
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id} 
                    className={cn("flex", isMine ? "justify-end" : "justify-start")}
                  >
                    {!isMine && (
                       <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                         {msg.senderId.username?.[0]?.toUpperCase() || 'U'}
                       </div>
                    )}
                    <div className="flex flex-col">
                      <div className={cn("flex items-end gap-2 mb-1", isMine ? "flex-row-reverse" : "")}>
                        {!isMine && <span className="text-sm font-semibold text-slate-200">{msg.senderId.username}</span>}
                        <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      
                      <div className={cn(
                        "max-w-md p-3 px-4",
                        isMine 
                          ? "bg-gradient-to-r from-[#6D5DFC] to-[#8B5CF6] text-white rounded-2xl rounded-tr-sm shadow-md" 
                          : "bg-white/5 border border-white/5 text-slate-200 rounded-2xl rounded-tl-sm"
                      )}>
                        {isImage && msg.fileUrl && (
                          <img src={`http://localhost:5000${msg.fileUrl}`} alt="attachment" className="max-w-full rounded-xl mb-2 max-h-72 object-cover border border-white/10" />
                        )}
                        
                        {isFile && msg.fileUrl && (
                          <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-black/20 rounded-xl mb-2 hover:bg-black/30 transition-colors border border-white/5">
                            <div className="p-2 bg-white/10 rounded-lg shrink-0"><Paperclip size={18} /></div>
                            <span className="font-semibold text-sm truncate">{msg.content}</span>
                          </a>
                        )}
                        
                        {(!isFile || !msg.fileUrl) && (
                          <p className="leading-relaxed text-[15px]">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#050816] relative z-20">
              {/* File Preview */}
              {selectedFile && (
                <div className="mb-2 p-2 bg-[#151924] rounded-xl flex items-center gap-3 relative border border-white/10 w-fit pr-10">
                  {filePreview ? (
                    <img src={filePreview} alt="preview" className="h-10 w-10 object-cover rounded-lg" />
                  ) : (
                    <div className="h-10 w-10 bg-[#1e293b] flex items-center justify-center rounded-lg text-slate-400">
                      <Paperclip size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pr-2 text-sm">
                    <p className="font-semibold truncate text-white">{selectedFile.name}</p>
                  </div>
                  <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="absolute right-2 p-1 hover:bg-white/10 rounded-full transition-colors">
                    <X size={14} className="text-slate-300" />
                  </button>
                </div>
              )}

              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 z-50">
                  <EmojiPicker 
                    theme={Theme.DARK} 
                    onEmojiClick={onEmojiClick}
                    lazyLoadEmojis={true}
                  />
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-end gap-3 max-w-5xl mx-auto">
                <div className="flex-1 flex items-center bg-[#151924] border border-white/10 rounded-full px-2 py-1.5 focus-within:border-[#8B5CF6]/50 transition-colors">
                  <label className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5 shrink-0">
                    <Paperclip size={20} />
                    <input type="file" className="hidden" onChange={handleFileSelect} />
                  </label>
                  
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:outline-none px-3 text-white placeholder:text-slate-500 font-medium text-[15px]"
                  />
                  
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-slate-400 hover:text-[#8B5CF6] transition-colors rounded-full hover:bg-white/5 shrink-0"
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    type="button" 
                    className="p-2 text-slate-400 hover:text-[#8B5CF6] transition-colors rounded-full hover:bg-white/5 shrink-0"
                  >
                    <Mic size={20} />
                  </button>
                  
                  <Button 
                    type="submit" 
                    className="ml-2 w-10 h-10 rounded-full bg-[#8B5CF6] hover:bg-[#7c4ce0] border-0 shrink-0 p-0 flex items-center justify-center"
                    disabled={sendMsgMutation.isPending || (!messageText.trim() && !selectedFile)}
                  >
                    <Send size={18} className="text-white ml-0.5" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-[#050816]">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-[#151924] border border-white/5">
              <Network size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {isCreatingGroup ? 'Establish Node' : 'No Chat Selected'}
            </h3>
            <p className="text-slate-500 text-sm">
              {isCreatingGroup ? 'Configure parameters for new group network.' : 'Select a conversation from the sidebar.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
