import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../context/ThemeProvider';
import { Settings as SettingsIcon, Palette, User, Shield, Bell } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Settings = () => {
  const user = useAuthStore(state => state.user);
  const { accentColor, setAccentColor } = useTheme();

  const accents = [
    { id: 'purple', name: 'Nexus Purple', hex: '#8B5CF6' },
    { id: 'blue', name: 'Quantum Blue', hex: '#3B82F6' },
    { id: 'pink', name: 'Neon Pink', hex: '#EC4899' },
    { id: 'cyan', name: 'Cyber Cyan', hex: '#06B6D4' },
  ];

  return (
    <div className="flex-1 flex flex-col glass-panel rounded-[2rem] border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] z-20 overflow-hidden relative">
      {/* Header */}
      <div className="h-[88px] px-8 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center z-20 shrink-0 gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-lg border border-white/10 shrink-0">
          <SettingsIcon size={24} className="text-slate-300" />
        </div>
        <div>
          <h2 className="font-bold text-xl leading-tight tracking-tight text-white">System Configuration</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage your neural interface preferences</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 scroll-smooth flex justify-center text-white">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Settings Nav */}
          <div className="space-y-2 col-span-1">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-medium flex items-center gap-3 shadow-sm">
              <User size={18} className="text-[#8B5CF6]" /> My Profile
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent text-slate-400 hover:text-white font-medium flex items-center gap-3 transition-colors">
              <Palette size={18} /> Appearance
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent text-slate-400 hover:text-white font-medium flex items-center gap-3 transition-colors">
              <Bell size={18} /> Notifications
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent text-slate-400 hover:text-white font-medium flex items-center gap-3 transition-colors">
              <Shield size={18} /> Privacy & Safety
            </button>
          </div>

          {/* Settings Content */}
          <div className="col-span-2 space-y-8">
            
            {/* Profile Section */}
            <section className="glass-card rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-500 to-transparent opacity-5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-slate-400" /> Profile Details
              </h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group/avatar cursor-pointer shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6D5DFC] to-[#06B6D4] flex items-center justify-center font-bold text-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)] border-2 border-transparent group-hover/avatar:border-white/20 transition-all">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold">Change</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold">{user?.username || 'Guest'}</h4>
                  <p className="text-slate-400 text-sm mt-1 font-mono">ID: {user?.id || 'pending...'}</p>
                </div>
              </div>
              <Button className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">Edit Profile</Button>
            </section>

            {/* Theme Section */}
            <section className="glass-card rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] opacity-5 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none group-hover:opacity-10 transition-opacity"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                <Palette size={20} className="text-slate-400" /> Interface Accent
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                {accents.map((accent) => (
                  <button
                    key={accent.id}
                    onClick={() => setAccentColor(accent.id as any)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden",
                      accentColor === accent.id 
                        ? "border-transparent" 
                        : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                    style={{
                      borderColor: accentColor === accent.id ? accent.hex : undefined,
                      backgroundColor: accentColor === accent.id ? `${accent.hex}15` : undefined,
                      boxShadow: accentColor === accent.id ? `0 0 20px ${accent.hex}30` : undefined,
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-white/10"
                      style={{ backgroundColor: accent.hex }}
                    />
                    <span className="text-xs font-semibold text-center text-slate-200">{accent.name}</span>
                    {accentColor === accent.id && (
                      <motion.div layoutId="activeAccent" className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
