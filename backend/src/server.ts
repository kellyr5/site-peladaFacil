import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/authRoutes';
import matchRoutes from './routes/matchRoutes';
import marketRoutes from './routes/marketRoutes';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pelada Fácil API is running!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/market', marketRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room
  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined room`);
  });

  // Join match room
  socket.on('join_match', (matchId: string) => {
    socket.join(`match:${matchId}`);
    console.log(`User joined match room: ${matchId}`);
  });

  // Leave match room
  socket.on('leave_match', (matchId: string) => {
    socket.leave(`match:${matchId}`);
    console.log(`User left match room: ${matchId}`);
  });

  // Market request broadcast
  socket.on('market_request', (data) => {
    io.emit('new_market_request', data);
  });

  // Match update
  socket.on('match_update', (data) => {
    io.to(`match:${data.matchId}`).emit('match_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available globally
export { io };

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
httpServer.listen(config.port, () => {
  console.log(`
🏆 Pelada Fácil API
🚀 Server running on port ${config.port}
🌍 Environment: ${config.nodeEnv}
📡 Frontend URL: ${config.frontendUrl}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
