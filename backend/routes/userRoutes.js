// backend/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  socialLoginUser,
  forgotPassword,
  resetPassword,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Публічні роути
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/social-login', socialLoginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Захищені роути
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Адмін роути
router.get('/', protect, admin, getUsers);
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUserRole);
router.put('/:id/toggle-status', protect, admin, toggleUserStatus);

export default router;

// // backend/routes/userRoutes.js
// import express from 'express';
// import {
//   registerUser,
//   loginUser, // змінено з authUser на loginUser
//   getUserProfile,
//   updateUserProfile,
//   socialLoginUser,
//   forgotPassword,
//   resetPassword
// } from '../controllers/userController.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.get('/', protect, admin, getUsers);
// router.route('/:id')
//   .delete(protect, admin, deleteUser)
//   .put(protect, admin, updateUserRole);
// router.put('/:id/toggle-status', protect, admin, toggleUserStatus);

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/social-login', socialLoginUser);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);
// router.route('/profile')

//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

// export default router;