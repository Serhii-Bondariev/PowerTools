// backend/controllers/userController.js
import { User } from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Функція генерації токена (перемістити на початок файлу)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Реєстрація користувача
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Будь ласка, надайте всі необхідні дані');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Користувач з таким email вже існує');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  }
});

// Логін користувача
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  const user = await User.findOne({ email });
  console.log('Found user:', user);

  if (!user) {
    res.status(401);
    throw new Error('Користувача не знайдено');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('Password validation:', { isValid: isPasswordValid });

  if (!isPasswordValid) {
    res.status(401);
    throw new Error('Невірний пароль');
  }

  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  };

  console.log('Sending user data:', userData);
  res.json(userData);
});

// Отримання профілю користувача
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin
  });
});

// Оновлення профілю користувача
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }
});

// export {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile
// };