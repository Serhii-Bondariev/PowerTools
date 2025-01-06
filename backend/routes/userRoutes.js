// backend/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser, // змінено з authUser на loginUser
  getUserProfile,
  updateUserProfile,
  socialLoginUser,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/social-login', socialLoginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.route('/profile')

  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;