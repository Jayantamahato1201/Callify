import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notification';
import { useSocket } from '../hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  });

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old) return [notification];
        return [notification, ...old];
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, queryClient]);

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
      >
        <Bell size={22} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-[#EC4899] rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)] border-2 border-[#050816]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-10 bottom-0 mb-14 md:mb-0 md:bottom-auto md:left-full md:ml-4 md:-top-2 w-80 glass-panel rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] border border-white/10 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs text-[#06B6D4] hover:text-cyan-300 transition-colors font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[350px] overflow-y-auto scrollbar-hide bg-[#0F1021]/80 backdrop-blur-md">
              {notifications?.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No new alerts.</div>
              ) : (
                notifications?.map((notif: any) => (
                  <div 
                    key={notif._id} 
                    onClick={() => {
                      if (!notif.isRead) markReadMutation.mutate(notif._id);
                    }}
                    className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 flex gap-4 transition-colors ${!notif.isRead ? 'bg-[#6D5DFC]/10' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6D5DFC] to-[#8B5CF6] flex-shrink-0 flex items-center justify-center text-white font-bold shadow-lg">
                      {notif.senderId?.username?.[0]?.toUpperCase() || '!'}
                    </div>
                    <div className="flex-1 min-w-0 text-sm">
                      <p className="text-slate-200 truncate">
                        <span className="font-bold text-white">{notif.senderId?.username}</span> {notif.content}
                      </p>
                      <p className="text-xs text-[#06B6D4] mt-1.5 opacity-80">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notif.isRead && <div className="w-2.5 h-2.5 bg-[#EC4899] rounded-full self-center shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
