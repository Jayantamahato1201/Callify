import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { initSocket } from './socket';

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  
  // Initialize Socket.io
  await initSocket(server);
  
  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
