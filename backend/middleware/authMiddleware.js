// // backend/middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';
// import { User } from '../models/userModel.js';

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];  // отримуємо токен

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select('-password');  // додаємо користувача до запиту

//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error('Не авторизовано, токен недійсний');
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Не авторизовано, токен відсутній');
//   }
// };

// export { protect };
// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Отримуємо токен з хедера
      token = req.headers.authorization.split(' ')[1];

      // Верифікуємо токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Додаємо користувача до запиту
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
};