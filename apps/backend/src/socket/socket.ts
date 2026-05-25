import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../config.js';
import { Assignment } from '../models/Assignment.model.js';

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: { origin: config.clientUrl, methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe', async (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`Socket ${socket.id} subscribed to ${assignmentId}`);

      // ── Race condition fix ──────────────────────────────────────
      // Check if job already completed before this socket subscribed
      try {
        const assignment = await Assignment.findById(assignmentId)
          .select('status paperId')
          .lean();

        if (assignment?.status === 'completed' && assignment?.paperId) {
          // Job already done — emit immediately to this socket only
          socket.emit('job:completed', {
            paperId: assignment.paperId.toString(),
            assignmentId,
          });
          console.log(`[socket] Late subscriber catch-up: emitted job:completed for ${assignmentId}`);
        }
      } catch (err) {
        console.error('[socket] catch-up check failed:', err);
      }
      // ────────────────────────────────────────────────────────────
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
