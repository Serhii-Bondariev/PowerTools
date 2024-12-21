// backend/routes/productRoutes.js
import express from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, addProduct); // Додати новий продукт - тільки авторизовані
router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct) // Оновлення продукту
  .delete(protect, deleteProduct); // Видалення продукту

export default router;
