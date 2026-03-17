import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import userRoutes from './modules/user/user.route';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SnapBook API is running!' });
});
app.use('/api/users', userRoutes);
export default app;