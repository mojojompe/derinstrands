import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import salesRoutes from './routes/salesRoutes';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import { requireAuth } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors({
  origin: ['https://derinstrands.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Serverless-friendly database connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Auth route is un-protected
app.use('/api/auth', authRoutes);

// Protect the following routes
app.use('/api/sales', requireAuth, salesRoutes);
app.use('/api/products', requireAuth, productRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('DerinStrands API is running');
});

// Export the app for Vercel
export default app;

// Listen only if not in production (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  });
}
