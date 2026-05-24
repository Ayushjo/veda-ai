import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../config.js';

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: { origin: config.clientUrl, methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe', ({ assignmentId }: { assignmentId: string }) => {
      socket.join(assignmentId);
      console.log(`Socket ${socket.id} subscribed to ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
