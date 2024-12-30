// backend/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser, // змінено з authUser на loginUser
  getUserProfile,
  updateUserProfile,
  socialLoginUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/social-login', socialLoginUser);
router.route('/profile')

  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;