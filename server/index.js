import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/note.js';

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});