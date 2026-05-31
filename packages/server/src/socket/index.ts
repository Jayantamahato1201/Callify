import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { env } from '../config/env';
import { verifyAccessToken } from '../utils/jwt';
import { Notification } from '../models/Notification';

let io: Server;

export const initSocket = async (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [env.clientUrl, 'http://localhost:5173', 'http://localhost:5174'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  const pubClient = createClient({ url: env.redisUrl });
  const subClient = pubClient.duplicate();

  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('Redis adapter connected for Socket.IO');
  } catch (err) {
    console.error('Redis connection failed, using in-memory adapter', err);
  }

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('accessToken=')[1];
    if (!token) return next(new Error('Authentication error'));
    
    const decoded = verifyAccessToken(token);
    if (!decoded) return next(new Error('Authentication error'));
    
    socket.data.userId = decoded.id;
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}`);

    // Join personal room for private events (like notifications)
    socket.join(`user:${userId}`);

    // Update user status to online in Redis or DB (simplified here)
    // User.findByIdAndUpdate(userId, { status: 'online' }).exec();
    io.emit('user_status', { userId, status: 'online' });

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing_start', { userId, conversationId });
    });

    socket.on('typing_end', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing_end', { userId, conversationId });
    });

    // WebRTC Signaling Events
    socket.on('call_initiate', ({ targetUserId, type, conversationId }) => {
      socket.to(`user:${targetUserId}`).emit('incoming_call', { callerId: userId, type, conversationId });
    });

    socket.on('call_accepted', ({ callerId }) => {
      socket.to(`user:${callerId}`).emit('call_accepted', { calleeId: userId });
    });

    socket.on('call_rejected', async ({ callerId }) => {
      socket.to(`user:${callerId}`).emit('call_rejected', { calleeId: userId });
      
      // Create missed call notification for callee
      const notification = await Notification.create({
        recipientId: userId,
        senderId: callerId,
        type: 'missed_call',
        content: 'Missed a call'
      });
      await notification.populate('senderId', 'username profilePicture');
      socket.emit('new_notification', notification);
    });

    socket.on('webrtc_offer', ({ targetUserId, offer }) => {
      socket.to(`user:${targetUserId}`).emit('webrtc_offer', { senderId: userId, offer });
    });

    socket.on('webrtc_answer', ({ targetUserId, answer }) => {
      socket.to(`user:${targetUserId}`).emit('webrtc_answer', { senderId: userId, answer });
    });

    socket.on('webrtc_ice_candidate', ({ targetUserId, candidate }) => {
      socket.to(`user:${targetUserId}`).emit('webrtc_ice_candidate', { senderId: userId, candidate });
    });

    socket.on('call_end', ({ targetUserId }) => {
      socket.to(`user:${targetUserId}`).emit('call_ended', { senderId: userId });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      io.emit('user_status', { userId, status: 'offline' });
      // User.findByIdAndUpdate(userId, { status: 'offline', lastSeen: new Date() }).exec();
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
