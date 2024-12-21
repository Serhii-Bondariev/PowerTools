// backend/controllers/userController.js
import { User } from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Реєстрація користувача
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Будь ласка, надайте всі необхідні дані' });
  }

  try {
    // Перевірка, чи існує користувач з таким email
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }

    // Створення нового користувача
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // Збереження користувача
    await user.save();

    // Генерація JWT токену
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Користувача успішно зареєстровано',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Отримати профіль користувача
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);  // використовуємо ID з токена

  if (!user) {
    res.status(404);
    throw new Error('Користувача не знайдено');
  }

  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
  });
});

// Логін користувача
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Будь ласка, надайте email та пароль' });
  }

  try {
    // Пошук користувача за email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    // Перевірка пароля
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний email або пароль' });
    }

    // Генерація JWT токену
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Логін успішний',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
