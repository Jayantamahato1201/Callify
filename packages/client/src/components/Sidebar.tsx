import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Sparkles, 
  Settings, 
  LogOut,
  Compass,
  Phone,
  Bookmark,
  Bell,
  Hash,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeProvider';
import { useUIStore } from '../store/useUIStore';
import { NotificationBell } from './NotificationBell';

export const Sidebar = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { accentColor } = useTheme();
  const { isAIPanelOpen, toggleAIPanel } = useUIStore();

  const getAccentClass = (isActive: boolean) => {
    if (!isActive) return 'text-slate-400 hover:text-white hover:bg-white/5';
    
    // According to image, active item has solid purple background with white text.
    return 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]';
  };

  const navItems = [
    { to: '/chat', icon: <MessageSquare size={18} />, label: 'Chats', badge: 8 },
    { to: '/friends', icon: <Users size={18} />, label: 'Friends', badge: 12 },
    { to: '/explore', icon: <Compass size={18} />, label: 'Groups' },
    { to: '/calls', icon: <Phone size={18} />, label: 'Calls' },
  ];

  const secondaryNav = [
    { to: '/saved', icon: <Bookmark size={18} />, label: 'Saved Messages' },
    { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications', badge: 5 },
  ];

  const channels = ['general', 'design-team', 'project-aurora', 'marketing', 'random'];

  return (
    <div className="w-[260px] hidden md:flex flex-col bg-[#0B0F19] z-40 shrink-0 h-full overflow-y-auto scrollbar-hide border-r border-white/5">
      
      {/* Brand Icon */}
      <div className="flex items-center gap-3 px-6 py-6 shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-white">NexusChat</h1>
      </div>
      
      {/* User Profile Row */}
      <div className="px-4 mb-4 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center font-bold text-white relative">
            {user?.username?.[0]?.toUpperCase() || 'U'}
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0B0F19]"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-sm">{user?.username}</h3>
            <p className="text-xs text-green-500">Online</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
        {/* Main Nav */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm group",
                getAccentClass(isActive)
              )}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", isActive ? "bg-white/20" : "bg-[#1e293b] text-slate-300 group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors")}>
                      {item.badge}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          <button 
            onClick={toggleAIPanel}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm mt-1",
              isAIPanelOpen ? "bg-[#8B5CF6]/20 text-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} className={isAIPanelOpen ? "text-[#8B5CF6]" : ""} />
              <span>AI Assistant</span>
            </div>
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B5CF6] text-white">
              New
            </div>
          </button>
        </div>

        {/* Secondary Nav */}
        <div className="space-y-1">
          {secondaryNav.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm group",
                getAccentClass(isActive)
              )}
            >
               {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", isActive ? "bg-white/20" : "bg-white/10 text-slate-300 group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors")}>
                      {item.badge}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Channels */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</span>
            <button className="text-slate-400 hover:text-white"><Plus size={14}/></button>
          </div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <div key={channel} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors group">
                <Hash size={16} className="text-slate-500 group-hover:text-slate-300" />
                <span className="truncate">{channel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 relative overflow-hidden group mx-2">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B5CF6]/20 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-[#8B5CF6]/30 transition-colors pointer-events-none"></div>
          <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
            <span className="text-yellow-500">👑</span> Upgrade to Pro
          </h4>
          <p className="text-xs text-slate-400 mb-4">Unlock more AI features, custom themes and more.</p>
          <button className="w-full py-2 bg-[#8B5CF6] hover:bg-[#7c4ce0] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between text-slate-400 shrink-0">
        <button className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Sparkles size={18}/></button>
        <div className="flex items-center justify-center -ml-1">
          <NotificationBell />
        </div>
        <button onClick={toggleAIPanel} className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Settings size={18}/></button>
        <button onClick={logout} className="p-2 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"><LogOut size={18}/></button>
      </div>
    </div>
  );
};
