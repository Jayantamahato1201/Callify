import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, MessageSquare, Bell, Shield, Globe } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('General');
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  const tabs = [
    { id: 'General', icon: <Settings size={18} /> },
    { id: 'Chat & Media', icon: <MessageSquare size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Privacy & Security', icon: <Shield size={18} /> },
    { id: 'Language', icon: <Globe size={18} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-[#050816]/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl h-[80vh] min-h-[500px] glass-panel rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex overflow-hidden z-10 bg-[#0B1020]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>

            {/* Sidebar */}
            <div className="w-1/3 max-w-[240px] border-r border-white/5 bg-white/5 p-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white mb-4 px-2 mt-2 tracking-tight">Settings</h2>
              
              <div className="flex-1 overflow-y-auto space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      activeTab === tab.id 
                        ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    {tab.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-transparent to-[#0B1020]/50 relative">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{activeTab}</h3>

                {activeTab === 'General' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <h4 className="text-sm font-semibold text-white mb-4">Account Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-slate-400 font-medium block mb-1">Username</label>
                          <input 
                            type="text" 
                            disabled 
                            value={user?.username || ''}
                            className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:outline-none opacity-70"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-medium block mb-1">Email</label>
                          <input 
                            type="text" 
                            disabled 
                            value={user?.email || ''}
                            className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:outline-none opacity-70"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Username and email changes are currently disabled in this preview.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab !== 'General' && (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                    <Settings size={48} className="text-slate-400 mb-4 animate-spin-slow" />
                    <p className="text-slate-300 font-medium">This section is under construction.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
