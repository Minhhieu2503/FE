import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('--- connectDB: Bắt đầu chạy mongoose.connect(). MONGODB_URI =', process.env.MONGODB_URI ? 'Có tồn tại (Đã che)' : 'UNDEFINED');
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};