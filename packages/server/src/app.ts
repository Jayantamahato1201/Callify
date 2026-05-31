import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import friendRoutes from './routes/friend.routes';
import chatRoutes from './routes/chat.routes';
import notificationRoutes from './routes/notification.routes';
import aiRoutes from './routes/ai.routes';
import uploadRoutes from './routes/upload.routes';
import path from 'path';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(cookieParser() as any);
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [env.clientUrl, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
