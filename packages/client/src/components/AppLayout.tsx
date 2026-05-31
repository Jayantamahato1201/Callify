import React from 'react';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { useTheme } from '../context/ThemeProvider';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen bg-[#0B0F19] text-foreground overflow-hidden selection:bg-primary/30 font-sans relative transition-colors duration-500">
      
      {/* Background Ambience based on Theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {theme === 'space' && (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636918-f29071a1fa0e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        )}
        {theme === 'galaxy' && (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        )}
      </div>

      {/* Main Container */}
      <div className="flex w-full h-full relative z-10 overflow-hidden bg-[#0B0F19]/50">
        {/* Column 1: Universal Sidebar */}
        <Sidebar />
        
        {/* Sub-Layout Container (Columns 2, 3) */}
        <div className="flex-1 flex min-w-0 h-full overflow-hidden border-l border-white/5">
          {children}
        </div>

        {/* Column 4: Right Sidebar (Profile/Customization) */}
        <RightSidebar />
      </div>
    </div>
  );
};
