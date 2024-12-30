// backend/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authService = {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  },

  async verifyGoogleToken(token, email) {
    try {
      const googleUserInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return googleUserInfo.data.email === email;
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  },

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
};