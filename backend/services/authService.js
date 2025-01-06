// backend/services/authService.js
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const authService = {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  },

  async verifyGoogleToken(token) {
    try {
      console.log('Verifying Google token');

      // Перевіряємо токен через Google API
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
      );

      console.log('Google token verification response:', response.data);

      if (!response.data.email_verified) {
        throw new Error('Email not verified');
      }

      return {
        valid: true,
        email: response.data.email
      };
    } catch (error) {
      console.error('Google token verification error:', error);
      return { valid: false };
    }
  },

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
};

// // backend/services/authService.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export const authService = {
//   generateToken(id) {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
//   },

//   async verifyGoogleToken(token, email) {
//     try {
//       const googleUserInfo = await axios.get(
//         'https://www.googleapis.com/oauth2/v3/userinfo',
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return googleUserInfo.data.email === email;
//     } catch (error) {
//       throw new Error('Invalid Google token');
//     }
//   },

//   async hashPassword(password) {
//     const salt = await bcrypt.genSalt(10);
//     return bcrypt.hash(password, salt);
//   }
// };