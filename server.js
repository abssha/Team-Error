import 'dotenv/config';
import express from 'express';
import { initDB } from './config/database.js';
import corsMiddleware from './middleware/cors.js';
import errorHandler from './middleware/errorHandler.js';

import healthRouter from './routes/health.js';
import chatRouter from './routes/chat.js';
import roomsRouter from './routes/rooms.js';
import appliancesRouter from './routes/appliances.js';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/chat', chatRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/rooms', appliancesRouter);   // nested: /api/rooms/:id/appliances
app.use('/api/appliances', appliancesRouter);
app.use('/api/settings', settingsRouter);

// Global error handler (must be last)
app.use(errorHandler);

// Boot
async function start() {
  await initDB();
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Phantom Load API running on http://localhost:${PORT}`);
  });
}

start();