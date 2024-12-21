// src/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;