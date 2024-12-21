// src/services/userService.js
import { User } from '../models/userModel';
import { generateToken } from '../utils/generateToken';

export const userService = {
  async register(userData) {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
      throw new Error('User already exists');
    }
    const user = await User.create(userData);
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    };
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      };
    }
    throw new Error('Invalid email or password');
  },
};
