import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import authRoutes from './modules/auth/auth.routes';
import passwordRoutes from './modules/password/password.routes';
import profileRoutes from './modules/profile/profile.routes';
import kycRoutes from './modules/kyc/kyc.routes';
import scheduleRoutes from './modules/schedule/schedule.routes';
import bookingRoutes from './modules/booking/booking.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import reviewRoutes from './modules/review/review.routes';
import voucherRoutes from './modules/voucher/voucher.routes';
import studioRoutes from './modules/studio/studio.routes';
import wishlistRoutes from './modules/wishlist/wishlist.routes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/auth', passwordRoutes);
app.use('/profile', profileRoutes);
app.use('/kyc', kycRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/bookings', bookingRoutes);
app.use('/deliveries', deliveryRoutes);
app.use('/wallet', walletRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/reviews', reviewRoutes);
app.use('/vouchers', voucherRoutes);
app.use('/studios', studioRoutes);
app.use('/wishlist', wishlistRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SnapBook API is running!' });
});

export default app;