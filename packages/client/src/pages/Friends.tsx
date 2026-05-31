import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchUsers, getFriends, getPendingRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../api/friend';
import { createOrGetDirectConversation } from '../api/chat';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Search, UserPlus, UserCheck, X, Check } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: searchResults, isLoading: searching } = useQuery({
    queryKey: ['searchUsers', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const { data: friends } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

  const { data: pendingRequests } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: getPendingRequests,
  });

  const sendReqMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['searchUsers'] })
  });

  const acceptReqMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });

  const rejectReqMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pendingRequests'] })
  });

  const startChatMutation = useMutation({
    mutationFn: createOrGetDirectConversation,
    onSuccess: (conv) => {
      navigate('/chat', { state: { activeConversationId: conv._id } });
    }
  });

  return (
    <>
      {/* Content Area */}
      <div className="flex-1 flex flex-col glass-panel rounded-[2rem] border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-20 overflow-hidden relative">
        
        {/* Header */}
        <div className="h-[88px] px-8 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center z-20 shrink-0 gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4] to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h2 className="font-bold text-xl leading-tight tracking-tight">Network Connections</h2>
            <p className="text-xs text-[#06B6D4] mt-0.5">Manage your neural nodes</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Search Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight glow-text">Discover Nodes</h3>
              </div>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#06B6D4]" />
                </div>
                <Input
                  type="text"
                  placeholder="Search global network by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 h-14 bg-[#050816] border-white/10 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-2xl text-lg text-white placeholder:text-slate-500 shadow-inner"
                />
                {searching && (
                  <div className="absolute right-4 top-4">
                    <div className="w-6 h-6 border-2 border-[#06B6D4] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {searchResults && searchResults.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((user: any) => (
                    <div key={user._id} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-white/20 transition-all hover:bg-white/10 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-slate-300 shadow-inner border border-white/5 group-hover:border-white/10">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-semibold text-lg">{user.username}</span>
                      </div>
                      <Button
                        onClick={() => sendReqMutation.mutate(user._id)}
                        disabled={sendReqMutation.isPending}
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-[#6D5DFC]/20 hover:bg-[#6D5DFC]/40 border border-[#6D5DFC]/50 text-[#8B5CF6] transition-all"
                      >
                        <UserPlus size={18} />
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
              {searchQuery.length > 2 && searchResults?.length === 0 && !searching && (
                <p className="text-slate-400 text-center py-4 bg-white/5 rounded-2xl border border-white/5">No nodes found matching your query.</p>
              )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Pending Requests */}
              <section className="glass-card rounded-[2rem] p-6 border border-[#EC4899]/20 relative overflow-hidden group hover:border-[#EC4899]/40 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#EC4899] to-transparent opacity-10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#EC4899]/20 text-[#EC4899] rounded-xl"><UserCheck size={20} /></div>
                  Pending Connections
                </h3>
                
                {pendingRequests?.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No incoming link requests.</p>
                ) : (
                  <ul className="space-y-3">
                    {pendingRequests?.map((req: any) => (
                      <li key={req._id} className="flex justify-between items-center bg-[#050816]/50 border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold">
                            {req.senderId.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-semibold">{req.senderId.username}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => acceptReqMutation.mutate(req._id)}
                            disabled={acceptReqMutation.isPending}
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 text-green-400 transition-all"
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            onClick={() => rejectReqMutation.mutate(req._id)}
                            disabled={rejectReqMutation.isPending}
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-400 transition-all"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Active Friends */}
              <section className="glass-card rounded-[2rem] p-6 border border-[#06B6D4]/20 relative overflow-hidden group hover:border-[#06B6D4]/40 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#06B6D4] to-transparent opacity-10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 bg-[#06B6D4]/20 text-[#06B6D4] rounded-xl"><Users size={20} /></div>
                  Active Nodes
                </h3>
                
                {friends?.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">Your neural network is empty.</p>
                ) : (
                  <ul className="space-y-3">
                    {friends?.map((friend: any) => (
                      <li key={friend._id} className="flex justify-between items-center bg-[#050816]/50 border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6D5DFC] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-lg">
                              {friend.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className={cn(
                              "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0F1021]",
                              friend.status === 'online' ? "bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.8)]" : "bg-slate-500"
                            )} />
                          </div>
                          <div>
                            <span className="font-semibold block">{friend.username}</span>
                            <span className={cn("text-xs", friend.status === 'online' ? "text-[#06B6D4]" : "text-slate-500")}>
                              {friend.status === 'online' ? 'Connected' : 'Offline'}
                            </span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => startChatMutation.mutate(friend._id)}
                          disabled={startChatMutation.isPending}
                          size="icon" 
                          className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8B5CF6] transition-all"
                        >
                          <MessageSquare size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
