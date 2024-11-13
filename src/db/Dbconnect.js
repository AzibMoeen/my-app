

// next js mongodb connection code using mongoose

import mongoose from 'mongoose';

let isConnected = false; // Track the connection status

export default async function connectToDatabase() {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('=> New database connection established');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
