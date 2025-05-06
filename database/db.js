import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDb;
