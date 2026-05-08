import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Connect to local MongoDB (ensure MongoDB is running)
    await mongoose.connect('mongodb+srv://shubhammagre972_db_user:90hcVyWqGKAlhtaW@cluster0.mqoas4y.mongodb.net/note_app?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;