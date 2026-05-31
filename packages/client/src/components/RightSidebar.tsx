import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Bell, MoreHorizontal, User, Settings, Image as ImageIcon, Shield, Globe, MessageSquare, Camera, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../context/ThemeProvider';
import { useUIStore } from '../store/useUIStore';
import { cn } from '../lib/utils';
import { NotificationBell } from './NotificationBell';
import { SettingsModal } from './SettingsModal';
import { uploadFile } from '../api/upload';
import { updateProfile } from '../api/auth';

export const RightSidebar = () => {
  const { isAIPanelOpen, setAIPanelOpen } = useUIStore();
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      const updatedUser = await updateProfile({ profilePicture: url });
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const accents = [
    { id: 'purple', hex: '#8B5CF6' },
    { id: 'blue', hex: '#3B82F6' },
    { id: 'cyan', hex: '#06B6D4' },
    { id: 'pink', hex: '#EC4899' },
    { id: 'orange', hex: '#F97316' },
    { id: 'red', hex: '#EF4444' },
  ];

  return (
    <AnimatePresence>
      {isAIPanelOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full flex flex-col bg-[#0B0F19] z-20 overflow-hidden border-l border-white/5 shrink-0"
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            
            {/* Header / Profile */}
            <div className="relative pt-12 pb-6 px-6 flex flex-col items-center border-b border-white/5">
              <button 
                onClick={() => setAIPanelOpen(false)} 
                className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/20 blur-3xl rounded-full pointer-events-none -mt-10 -mr-10"></div>
              
              <div className="relative w-24 h-24 mb-4 group cursor-pointer">
                <label className="w-full h-full block cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} disabled={isUploading} />
                  {user?.profilePicture ? (
                    <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="w-full h-full rounded-full object-cover shadow-[0_0_20px_rgba(139,92,246,0.3)] border-2 border-[#8B5CF6]/50" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  </div>
                </label>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0F19]"></div>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                {user?.username} <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#8B5CF6] text-white font-bold tracking-wider">PRO</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4 text-center">Building the future, one line of code at a time. 💻✨</p>
              
              <div className="flex justify-center gap-6 w-full">
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-[#151924] border border-white/5 flex items-center justify-center text-slate-300 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                    <User size={18} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white">Profile</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-[#151924] border border-white/5 flex items-center justify-center text-slate-300 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                    <Lock size={18} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white">Privacy</span>
                </div>
                <div className="flex flex-col items-center gap-1 group relative">
                  <NotificationBell />
                  <span className="text-[10px] text-slate-400 group-hover:text-white mt-[-4px]">Alerts</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-[#151924] border border-white/5 flex items-center justify-center text-slate-300 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                    <MoreHorizontal size={18} />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white">More</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Customization</h3>
              
              {/* Theme Toggle */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-2">Theme</p>
                <div className="flex bg-[#151924] p-1 rounded-xl border border-white/5">
                  <button onClick={() => setTheme('light')} className={cn("flex-1 py-1.5 text-xs rounded-lg transition-all", theme === 'light' ? "bg-[#8B5CF6] text-white font-semibold shadow-md" : "text-slate-400 hover:text-white")}>Light</button>
                  <button onClick={() => setTheme('dark')} className={cn("flex-1 py-1.5 text-xs rounded-lg transition-all", theme === 'dark' ? "bg-[#8B5CF6] text-white font-semibold shadow-md" : "text-slate-400 hover:text-white")}>Dark</button>
                  <button onClick={() => setTheme('space')} className={cn("flex-1 py-1.5 text-xs rounded-lg transition-all", theme === 'space' ? "bg-[#8B5CF6] text-white font-semibold shadow-md" : "text-slate-400 hover:text-white")}>Space</button>
                </div>
              </div>

              {/* Accent Colors */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-2">Accent Color</p>
                <div className="flex flex-wrap gap-3">
                  {accents.map((accent) => (
                    <button 
                      key={accent.id}
                      onClick={() => setAccentColor(accent.id as any)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                        accentColor === accent.id ? `border-[${accent.hex}]` : "border-transparent hover:border-white/20"
                      )}
                      style={{ borderColor: accentColor === accent.id ? accent.hex : undefined }}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accent.hex }}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Backgrounds */}
              <div className="mb-8">
                <p className="text-xs text-slate-400 mb-2">Chat Background</p>
                <div className="flex gap-2">
                  <div className="w-14 h-14 rounded-xl border-2 border-[#8B5CF6] bg-[#0B0F19] cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent"></div>
                  </div>
                  <div className="w-14 h-14 rounded-xl border-2 border-transparent hover:border-white/20 bg-slate-800 cursor-pointer overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534796636918-f29071a1fa0e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
                  </div>
                  <div className="w-14 h-14 rounded-xl border-2 border-transparent hover:border-white/20 bg-slate-800 cursor-pointer overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
                  </div>
                  <div className="w-14 h-14 rounded-xl border-2 border-transparent hover:border-white/20 bg-gradient-to-r from-purple-400 to-pink-500 cursor-pointer opacity-80"></div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white mb-4">Settings</h3>
              
              <div className="space-y-1">
                {[
                  { icon: <Settings size={16} />, label: 'General' },
                  { icon: <MessageSquare size={16} />, label: 'Chat & Media' },
                  { icon: <Bell size={16} />, label: 'Notifications' },
                  { icon: <Shield size={16} />, label: 'Privacy & Security' },
                  { icon: <Globe size={16} />, label: 'Language', extra: 'English' },
                ].map((item, i) => (
                  <div key={i} onClick={() => setIsSettingsOpen(true)} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3 text-slate-300 group-hover:text-white">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.extra && <span className="text-xs text-slate-500">{item.extra}</span>}
                      <ChevronRight size={14} className="text-slate-500 group-hover:text-white" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>
      )}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </AnimatePresence>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
