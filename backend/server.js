// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';




dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgYellow);
});