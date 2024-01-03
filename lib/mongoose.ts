import mongoose, { ConnectOptions } from 'mongoose';

import logger from '@/lib/utils/logger';

const uri = process.env.MONGODB_URI as string;
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!uri) return logger.r('Invalid/Missing MONGODB_URI');
  if (isConnected) return logger.b('Already connected to MongoDB');

  try {
    await mongoose.connect(uri);
    isConnected = true;
    logger.g('Connected to MongoDB');
  } catch (err) {
    logger.r('MongoDB connection error', err);
  }
};
