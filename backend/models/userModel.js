// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Ім\'я обов\'язкове'],
    trim: true,
    minlength: [2, 'Ім\'я повинно містити мінімум 2 символи']
  },
  lastName: {
    type: String,
    required: [true, 'Прізвище обов\'язкове'],
    trim: true,
    minlength: [2, 'Прізвище повинно містити мінімум 2 символи']
  },
  email: {
    type: String,
    required: [true, 'Email обов\'язковий'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Будь ласка, введіть коректний email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обов\'язковий'],
    minlength: [6, 'Пароль повинен містити мінімум 6 символів']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, 'Будь ласка, введіть коректний номер телефону']
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  socialProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Методи
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Помилка при порівнянні паролів');
  }
};

userSchema.methods.incrementLoginAttempts = async function() {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хвилин
  }
  await this.save();
};

userSchema.methods.resetLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.accountLockUntil = null;
  this.lastLogin = new Date();
  await this.save();
};

// Middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Віртуальні поля
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('isLocked').get(function() {
  return !!(this.accountLockUntil && this.accountLockUntil > new Date());
});

// Індекси - видаляємо дублювання
userSchema.index({ resetPasswordToken: 1 });

export const User = mongoose.model('User', userSchema);


// // backend/models/userModel.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// // Описуємо схему для користувача
// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [/^\S+@\S+\.\S+$/, 'Будь ласка, введіть коректний email'], // Додав валідацію для email
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     // Можна додати валідацію для телефону, якщо потрібно
//   },
//   isAdmin: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },
//   socialProvider: {
//     type: String,
//     enum: ['google', 'facebook', null],
//     default: null
//   }
// }, {
//   timestamps: true, // Додаємо часові мітки для створення та оновлення
// });

// // Метод для порівняння паролів
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   console.log('Comparing passwords:', {
//     entered: enteredPassword,
//     stored: this.password
//   });
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // При реєстрації
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// export const User = mongoose.model('User', userSchema);
