import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseConn {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global scope to persist connection across hot reloads in development
let cached: MongooseConn = (global as unknown as { mongoose: MongooseConn }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseConn }).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose: typeof import('mongoose')) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Error connecting to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
