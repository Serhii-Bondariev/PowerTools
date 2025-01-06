// backend/routes/orderRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  deleteOrder,
  generateInvoice
} from '../controllers/orderController.js';

const router = express.Router();

// Базовий захист для всіх роутів
router.use(protect);

// Адмін роути (мають бути першими)
router.route('/')
  .get(admin, getOrders)     // GET /api/orders - отримання всіх замовлень (тільки адмін)
  .post(createOrder);        // POST /api/orders - створення замовлення (всі користувачі)

// Користувацькі роути
router.get('/my-orders', getMyOrders);  // GET /api/orders/my-orders - замовлення поточного користувача

// Роути з параметрами (мають бути останніми)
router.route('/:id')
  .get(getOrderById)                    // GET /api/orders/:id - деталі замовлення
  .delete(admin, deleteOrder);          // DELETE /api/orders/:id - видалення замовлення (тільки адмін)

router.get('/:id/invoice', generateInvoice);    // GET /api/orders/:id/invoice - генерація інвойсу
router.put('/:id/status', admin, updateOrderStatus); // PUT /api/orders/:id/status - оновлення статусу (тільки адмін)

export default router;

// // backend/routes/orderRoutes.js
// import express from 'express';
// import { protect, admin } from '../middleware/authMiddleware.js';
// import {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus,
//   getMyOrders,
//   deleteOrder,
//   generateInvoice // Додаємо імпорт generateInvoice
// } from '../controllers/orderController.js';

// const router = express.Router();

// // Захищені роути
// router.use(protect);

// // Користувацькі роути
// router.route('/').post(createOrder);
// router.get('/my-orders', getMyOrders);

// // Роут для інвойсу має бути перед :id роутом
// router.get('/:id/invoice', generateInvoice);

// // Інші роути з параметром :id
// router.get('/:id', getOrderById);

// // Адмін роути
// router.get('/', protect, admin, getOrders);
// router.put('/:id/status', protect, admin, updateOrderStatus);
// router.delete('/:id', protect, admin, deleteOrder);

// export default router;