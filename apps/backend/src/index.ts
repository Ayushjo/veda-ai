import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config.js';
import { initSocket } from './socket/socket.js';
import './workers/generation.worker.js'; // importing starts the worker
import assignmentRouter from './routes/assignment.routes.js';
import paperRouter from './routes/paper.routes.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: [
    config.clientUrl,
    "https://veda-ai-frontend-sand.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API routes
app.use('/api/assignments', assignmentRouter);
app.use('/api/papers', paperRouter);

// Global error handler
app.use((err: Error, _req: import('express').Request, res: import('express').Response, _next: import('express').NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB then start server
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.mongoUri}/${config.dbName}`,
    );
    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error', error);
    process.exit(1);
  }
};

async function start() {
  await connectDB();

  // Initialize Socket.io
  initSocket(httpServer);

  const port = Number(config.port);
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start();
