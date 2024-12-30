// backend/controllers/userController.js
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import { sendEmail, getPasswordResetHTML } from '../middleware/emailMiddleware.js';

// Реєстрація
export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await userService.findByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'Користувач вже існує' });
    }

    const user = await userService.createUser(req.body);
    const token = authService.generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Помилка при реєстрації' });
  }
};

// Логін
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Невірні дані для входу' });
    }

    const token = authService.generateToken(user._id);
    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера при вході' });
  }
};

// Відновлення паролю
export const forgotPassword = async (req, res) => {
  try {
    console.log('1. Starting password reset process');
    const { email } = req.body;
    console.log('2. Received email:', email);

    const user = await userService.findByEmail(email);
    console.log('3. User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    console.log('4. Generating reset token');
    const resetToken = Math.random().toString(36).substring(2, 15);
    const hashedToken = await authService.hashPassword(resetToken);

    console.log('5. Updating user with reset token');
    await userService.updateUser(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 3600000
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('6. Reset URL generated:', resetUrl);

    console.log('7. Attempting to send email');
    await sendEmail({
      email: user.email,
      subject: 'Відновлення паролю на PowerTools',
      html: getPasswordResetHTML(resetUrl)
    });
    console.log('8. Email sent successfully');

    res.json({
      message: 'Інструкції з відновлення паролю відправлені на вашу пошту',
      success: true
    });
  } catch (error) {
    console.error('Detailed password reset error:', {
      message: error.message,
      stack: error.stack,
      details: error
    });

    res.status(500).json({
      message: 'Помилка при відправці інструкцій з відновлення паролю',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Соціальний логін
export const socialLoginUser = async (req, res) => {
  try {
    const { provider, token, email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (provider === 'google') {
      const isValidToken = await authService.verifyGoogleToken(token, email);
      if (!isValidToken) {
        return res.status(401).json({ message: 'Invalid Google token' });
      }
    }

    let user = await userService.findByEmail(email);
    if (!user) {
      user = await userService.createSocialUser(provider, email, firstName, lastName);
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: authService.generateToken(user._id)
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(401).json({ message: 'Помилка автентифікації через соціальну мережу' });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const user = await userService.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Помилка при отриманні профілю' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await userService.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const updateData = {
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone
    };

    if (req.body.password) {
      updateData.password = await authService.hashPassword(req.body.password);
    }

    const updatedUser = await userService.updateUser(user._id, updateData);
    const token = authService.generateToken(updatedUser._id);

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Помилка при оновленні профілю' });
  }
};

// export {
//   registerUser,
//   loginUser,
//   forgotPassword,
//   socialLoginUser,
//   getUserProfile,    // Додаємо новий експорт
//   updateUserProfile  // Додаємо новий експорт
// };
// // backend/controllers/userController.js
// import { User } from '../models/userModel.js';
// import asyncHandler from 'express-async-handler';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import axios from 'axios';

// // Функція генерації токена
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d'
//   });
// };

// // Реєстрація користувача
// //
// export const registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, phone } = req.body;
//     console.log('Registration attempt:', {
//       email,
//       password: '***',
//       firstName,
//       lastName
//     });

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'Користувач вже існує' });
//     }

//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password, // Має хешуватися автоматично через pre-save hook
//       phone
//     });

//     console.log('User created:', {
//       id: user._id,
//       email: user.email,
//       hashedPassword: user.password
//     });

//     const token = generateToken(user._id);
//     res.status(201).json({
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       phone: user.phone,
//       isAdmin: user.isAdmin,
//       token
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Помилка при реєстрації' });
//   }
// };

// // Логін користувача
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log('Login attempt:', { email, password: '***' });

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Користувача не знайдено' });
//     }

//     // Додаємо логування для відладки
//     console.log('Found user:', {
//       id: user._id,
//       email: user.email,
//       hashedPassword: user.password
//     });

//     const isPasswordValid = await user.matchPassword(password);
//     console.log('Password validation result:', isPasswordValid);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Невірний пароль' });
//     }

//     const token = generateToken(user._id);
//     res.json({
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         isAdmin: user.isAdmin
//       },
//       token
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Помилка сервера при вході' });
//   }
// };

// //reset password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'Користувача не знайдено' });
//     }

//     // Тут можна додати логіку відправки email
//     // Наприклад, використовуючи nodemailer

//     res.json({ message: 'Інструкції відправлені на пошту' });
//   } catch (error) {
//     res.status(500).json({ message: 'Помилка сервера' });
//   }
// };


// // Отримання профілю користувача
// export const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404);
//     throw new Error('Користувача не знайдено');
//   }

//   res.json({
//     _id: user._id,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email,
//     phone: user.phone,
//     isAdmin: user.isAdmin
//   });
// });

// // Соціальна авторизація
// export const socialLoginUser = asyncHandler(async (req, res) => {
//   const { provider, token, email, firstName, lastName } = req.body;
//   console.log('Social login attempt:', { provider, email });

//   try {
//     if (!email) {
//       res.status(400);
//       throw new Error('Email is required');
//     }

//     // Перевіряємо токен Google
//     if (provider === 'google') {
//       try {
//         const googleUserInfo = await axios.get(
//           'https://www.googleapis.com/oauth2/v3/userinfo',
//           {
//             headers: { Authorization: `Bearer ${token}` }
//           }
//         );

//         if (googleUserInfo.data.email !== email) {
//           throw new Error('Invalid token');
//         }
//       } catch (error) {
//         console.error('Google token verification failed:', error);
//         res.status(401);
//         throw new Error('Invalid Google token');
//       }
//     }

//     // Шукаємо або створюємо користувача
//     let user = await User.findOne({ email });

//     if (!user) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);

//       user = await User.create({
//         firstName,
//         lastName,
//         email,
//         password: hashedPassword,
//         socialProvider: provider
//       });
//     }

//     // Відправляємо відповідь
//     res.json({
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user._id)
//     });

//   } catch (error) {
//     console.error('Social login error:', error);
//     res.status(401);
//     throw new Error('Помилка автентифікації через соціальну мережу');
//   }
// });

// // Оновлення профілю користувача
// export const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.firstName = req.body.firstName || user.firstName;
//     user.lastName = req.body.lastName || user.lastName;
//     user.email = req.body.email || user.email;
//     user.phone = req.body.phone || user.phone;

//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(req.body.password, salt);
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       firstName: updatedUser.firstName,
//       lastName: updatedUser.lastName,
//       email: updatedUser.email,
//       phone: updatedUser.phone,
//       isAdmin: updatedUser.isAdmin,
//       token: generateToken(updatedUser._id)
//     });
//   } else {
//     res.status(404);
//     throw new Error('Користувача не знайдено');
//   }
// });
