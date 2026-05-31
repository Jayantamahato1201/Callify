import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    const socketInstance = io('http://localhost:5000', {
      auth: { token: accessToken },
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken]);

  return socket;
};
