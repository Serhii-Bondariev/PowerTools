// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
    default: null,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
    select: false
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
  lastActive: {
    type: Date,
    default: Date.now
  },

  activityLog: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: Object
  }],
  accountLockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Методи для роботи з паролем
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Помилка при порівнянні паролів');
  }
};

// Методи для скидання паролю
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 година
  return resetToken;
};

userSchema.methods.clearResetToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

userSchema.methods.isResetTokenValid = function(token) {
  return (
    this.resetPasswordToken === token &&
    this.resetPasswordExpires > Date.now()
  );
};

// Методи для безпеки облікового запису
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

// Middleware для хешування паролю
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

// Індекс для токену скидання паролю
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// Налаштування схеми
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});

// Створення моделі
const User = mongoose.model('User', userSchema);

export { User };

 // // backend/models/userModel.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';

// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: [true, 'Ім\'я обов\'язкове'],
//     trim: true,
//     minlength: [2, 'Ім\'я повинно містити мінімум 2 символи']
//   },
//   lastName: {
//     type: String,
//     required: [true, 'Прізвище обов\'язкове'],
//     trim: true,
//     minlength: [2, 'Прізвище повинно містити мінімум 2 символи']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email обов\'язковий'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\S+@\S+\.\S+$/, 'Будь ласка, введіть коректний email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Пароль обов\'язковий'],
//     minlength: [6, 'Пароль повинен містити мінімум 6 символів']
//   },
//   phone: {
//     type: String,
//     trim: true,
//     match: [/^\+?[\d\s-]{10,}$/, 'Будь ласка, введіть коректний номер телефону']
//   },
//   isAdmin: {
//     type: Boolean,
//     required: true,
//     default: false
//   },
//   socialProvider: {
//     type: String,
//     enum: ['google', 'facebook', null],
//     default: null
//   },
//   resetPasswordToken: {
//     type: String,
//     default: null,
//     index: true,
//     select: false // Не повертати токен при звичайних запитах
//   },
//   resetPasswordExpires: {
//     type: Date,
//     default: null,
//     select: false // Не повертати дату закінчення при звичайних запитах
//   },
//   lastLogin: {
//     type: Date,
//     default: null
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   failedLoginAttempts: {
//     type: Number,
//     default: 0
//   },
//   accountLockUntil: {
//     type: Date,
//     default: null
//   }
// }, {
//   timestamps: true
// });

// // Методи
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   try {
//     return await bcrypt.compare(enteredPassword, this.password);
//   } catch (error) {
//     throw new Error('Помилка при порівнянні паролів');
//   }
// };

// // Додаємо методи для роботи з токеном
// userSchema.methods.createPasswordResetToken = function() {
//   // Генеруємо токен
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   // Зберігаємо токен
//   this.resetPasswordToken = resetToken;
//   this.resetPasswordExpires = Date.now() + 3600000; // 1 година

//   return resetToken;
// };

// userSchema.methods.clearResetToken = function() {
//   this.resetPasswordToken = undefined;
//   this.resetPasswordExpires = undefined;
// };

// userSchema.methods.isResetTokenValid = function(token) {
//   return (
//     this.resetPasswordToken === token &&
//     this.resetPasswordExpires > Date.now()
//   );
// };

// userSchema.methods.incrementLoginAttempts = async function() {
//   this.failedLoginAttempts += 1;
//   if (this.failedLoginAttempts >= 5) {
//     this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хвилин
//   }
//   await this.save();
// };

// userSchema.methods.resetLoginAttempts = async function() {
//   this.failedLoginAttempts = 0;
//   this.accountLockUntil = null;
//   this.lastLogin = new Date();
//   await this.save();
// };

// // Хешування паролю
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Віртуальні поля
// userSchema.virtual('fullName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

// userSchema.virtual('isLocked').get(function() {
//   return !!(this.accountLockUntil && this.accountLockUntil > new Date());
// });

// // Індекси - видаляємо дублювання
// userSchema.index({ resetPasswordToken: 1 });

// export const User = mongoose.model('User', userSchema);