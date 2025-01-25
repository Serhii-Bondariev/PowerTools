// backend/routes/productRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getFeaturedProducts,
  toggleFavorite,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
// import Order from '../models/orderModel.js'; // Import Order model
// import Product from '../models/productModel.js'; // Import Product model

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.',
      ),
      false,
    );
  }
};

// Multer setup
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Public routes
router.get('/featured', getFeaturedProducts); // Use the controller for featured products
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/favorite', protect, toggleFavorite);

// Protected admin routes
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  handleMulterError,
  createProduct,
);

router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  handleMulterError,
  updateProduct,
);

router.delete('/:id', protect, admin, deleteProduct);

export default router;

// // backend/routes/productRoutes.js
// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import {
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProducts,
//   getProductById,
//   getFeaturedProducts,
//   toggleFavorite,
// } from '../controllers/productController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Налаштування multer для завантаження файлів
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // Фільтр для перевірки типів файлів
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'), false);
//   }
// };

// // Налаштування multer
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB ліміт
//   }
// });

// // Middleware для обробки помилок multer
// const handleMulterError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
//     }
//     return res.status(400).json({ message: err.message });
//   } else if (err) {
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// };

// // Public routes
// router.get('/featured', getFeaturedProducts);
// router.get('/', getProducts);
// router.get('/:id', getProductById);
// router.post('/:id/favorite', protect, toggleFavorite);

// // Захищені роути для адміна
// router.post('/',
//   protect,
//   admin,
//   upload.single('image'),
//   handleMulterError,
//   createProduct
// );

// router.put('/:id',
//   protect,
//   admin,
//   upload.single('image'),
//   handleMulterError,
//   updateProduct
// );

// router.delete('/:id', protect, admin, deleteProduct);

// export default router;
