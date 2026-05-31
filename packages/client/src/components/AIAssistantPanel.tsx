import React from 'react';
import { Bot, Sparkles, Send, X, Mic, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistantPanel = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 350, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full flex flex-col glass-panel rounded-[2rem] border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-20 overflow-hidden shrink-0"
        >
          {/* Header */}
          <div className="h-[88px] px-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <Bot size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight tracking-tight text-white">Nexus AI</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold">Online</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="glass rounded-[20px] rounded-tl-sm p-4 text-sm text-white border border-white/10">
                Greetings! I am Nexus AI. I can summarize your conversations, suggest replies, or help you find information. How can I assist you today?
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/5">
            <div className="glass-card rounded-2xl border border-white/10 flex flex-col focus-within:border-[#A855F7]/50 transition-colors">
              <textarea 
                placeholder="Ask Nexus AI..."
                className="w-full bg-transparent border-none focus:outline-none p-3 text-sm text-white resize-none h-20 placeholder:text-slate-500"
              />
              <div className="flex justify-between items-center p-2 border-t border-white/5">
                <div className="flex gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"><ImageIcon size={16}/></button>
                  <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"><Mic size={16}/></button>
                </div>
                <Button size="icon" className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EC4899] border-0 hover:opacity-90">
                  <Send size={14} className="text-white ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
