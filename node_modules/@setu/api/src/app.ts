import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import tourismRoutes from './routes/tourismRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import offeringRoutes from './routes/offeringRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cityHubRoutes from './routes/cityHubRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  // Map tile providers require the requesting site's origin for identification.
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginOpenerPolicy: {
    policy: 'same-origin-allow-popups'
  }
}));

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'SETU Bihar Tourism API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', tourismRoutes); // /api/circuits, /api/destinations, /api/districts, /api/events
app.use('/api', cityHubRoutes); // /api/city-hubs, /api/city-hubs/:slug
app.use('/api/vendors', vendorRoutes);
app.use('/api/offerings', offeringRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/conversations', messageRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

if (env.NODE_ENV === 'production') {
  const webDist = path.resolve(__dirname, '../../web/dist');

  app.use(express.static(webDist));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(webDist, 'index.html'));
  });
}
// Global Error Handler
app.use(errorHandler);

export default app;
