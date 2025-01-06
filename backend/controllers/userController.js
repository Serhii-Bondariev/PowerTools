// backend/controllers/userController.js
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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
    const { email } = req.body;
    console.log('Processing password reset for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    // Генеруємо простий токен
    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Generated plain token:', resetToken);

    // Зберігаємо токен в базі без хешування
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 година
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Reset URL created:', resetUrl);

    await sendEmail({
      email: user.email,
      subject: 'Відновлення паролю на PowerTools',
      html: getPasswordResetHTML(resetUrl)
    });

    res.json({
      message: 'Інструкції з відновлення паролю відправлені на вашу пошту',
      success: true
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Помилка при відправці інструкцій'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log('Reset password attempt with token:', token);

    if (!token || !password) {
      return res.status(400).json({
        message: 'Відсутній токен або пароль'
      });
    }

    // Шукаємо користувача за нехешованим токеном
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    console.log('User search result:', {
      found: !!user,
      tokenExpired: user?.resetPasswordExpires < Date.now()
    });

    if (!user) {
      return res.status(400).json({
        message: 'Токен для відновлення паролю недійсний або застарів'
      });
    }

    // Хешуємо новий пароль
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Очищаємо токен
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    console.log('Password reset successful for user:', user.email);

    res.json({
      success: true,
      message: 'Пароль успішно змінено'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Помилка при зміні паролю',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Відновлення паролю
// export const forgotPassword = async (req, res) => {
//   try {
//     console.log('1. Starting password reset process');
//     const { email } = req.body;
//     console.log('2. Received email:', email);

//     const user = await userService.findByEmail(email);
//     console.log('3. User found:', user ? 'Yes' : 'No');

//     if (!user) {
//       return res.status(404).json({ message: 'Користувача не знайдено' });
//     }

//     console.log('4. Generating reset token');
//     const resetToken = Math.random().toString(36).substring(2, 15);
//     const hashedToken = await authService.hashPassword(resetToken);

//     console.log('5. Updating user with reset token');
//     await userService.updateUser(user._id, {
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: Date.now() + 3600000
//     });

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     console.log('Generated reset URL:', resetUrl); // Для перевірки

//     await sendEmail({
//       email: user.email,
//       subject: 'Відновлення паролю на PowerTools',
//       html: getPasswordResetHTML(resetUrl)
//     });
//     console.log('8. Email sent successfully');

//     res.json({
//       message: 'Інструкції з відновлення паролю відправлені на вашу пошту',
//       success: true
//     });
//   } catch (error) {
//     console.error('Detailed password reset error:', {
//       message: error.message,
//       stack: error.stack,
//       details: error
//     });

//     res.status(500).json({
//       message: 'Помилка при відправці інструкцій з відновлення паролю',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     console.log('Reset password request received:', {
//       token: req.body.token ? 'exists' : 'missing',
//       passwordLength: req.body.password ? req.body.password.length : 0
//     });

//     const { token, password } = req.body;

//     if (!token || !password) {
//       return res.status(400).json({
//         message: 'Відсутній токен або пароль'
//       });
//     }

//     // Знаходимо користувача за хешованим токеном
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     console.log('User found:', user ? 'Yes' : 'No');

//     if (!user) {
//       return res.status(400).json({
//         message: 'Токен для відновлення паролю недійсний або застарів'
//       });
//     }

//     // Встановлюємо новий пароль
//     user.password = password; // Хешування відбудеться автоматично через pre-save hook
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();
//     console.log('Password successfully reset for user:', user.email);

//     res.json({
//       success: true,
//       message: 'Пароль успішно змінено'
//     });
//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({
//       message: 'Помилка при зміні паролю',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// Соціальний логін


export const socialLoginUser = async (req, res) => {
  try {
    const { provider, token, email, firstName, lastName } = req.body;
    console.log('Social login attempt:', { provider, email, firstName, lastName });

    if (!token || !email) {
      return res.status(400).json({
        message: 'Token and email are required'
      });
    }

    if (provider === 'google') {
      const verification = await authService.verifyGoogleToken(token);
      console.log('Token verification result:', verification);

      if (!verification.valid) {
        return res.status(401).json({
          message: 'Invalid Google token'
        });
      }

      if (verification.email !== email) {
        return res.status(401).json({
          message: 'Email mismatch'
        });
      }
    }

    let user = await User.findOne({ email });

    if (!user) {
      console.log('Creating new user');
      user = await User.create({
        email,
        firstName,
        lastName,
        password: Math.random().toString(36),
        socialProvider: provider
      });
    }

    const authToken = authService.generateToken(user._id);
    console.log('Login successful for:', email);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: authToken
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(401).json({
      message: 'Помилка автентифікації через соціальну мережу',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// export const socialLoginUser = async (req, res) => {
//   try {
//     const { provider, token, email, firstName, lastName } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }

//     if (provider === 'google') {
//       const isValidToken = await authService.verifyGoogleToken(token, email);
//       if (!isValidToken) {
//         return res.status(401).json({ message: 'Invalid Google token' });
//       }
//     }

//     let user = await userService.findByEmail(email);
//     if (!user) {
//       user = await userService.createSocialUser(provider, email, firstName, lastName);
//     }

//     res.json({
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: authService.generateToken(user._id)
//     });
//   } catch (error) {
//     console.error('Social login error:', error);
//     res.status(401).json({ message: 'Помилка автентифікації через соціальну мережу' });
//   }
// };
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
