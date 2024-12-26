// backend/routes/orderRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Захищені роути
router.use(protect);

// Користувацькі роути
router.route('/').post(createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Адмін роути
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;