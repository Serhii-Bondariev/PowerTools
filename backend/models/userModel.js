// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Описуємо схему для користувача
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Будь ласка, введіть коректний email'], // Додав валідацію для email
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    // Можна додати валідацію для телефону, якщо потрібно
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  socialProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  }
}, {
  timestamps: true, // Додаємо часові мітки для створення та оновлення
});

// Метод для порівняння паролів
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Хешуємо пароль перед збереженням
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();  // Якщо пароль не змінювався, не потрібно хешувати його знову
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Створення моделі користувача на основі схеми
export const User = mongoose.model('User', userSchema);
