import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import authRoutes from './modules/auth/auth.routes';
import passwordRoutes from './modules/password/password.routes';

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

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SnapBook API is running!' });
});

export default app;