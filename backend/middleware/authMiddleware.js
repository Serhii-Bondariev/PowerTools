// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];  // отримуємо токен

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');  // додаємо користувача до запиту

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Не авторизовано, токен недійсний');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Не авторизовано, токен відсутній');
  }
};

export { protect };
