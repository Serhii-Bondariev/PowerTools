// backend/services/userService.js
import { User } from '../models/userModel.js';
import { authService } from './authService.js';

export const userService = {
  async findByEmail(email) {
    return User.findOne({ email });
  },

  async findById(id) {
    return User.findById(id);
  },

  async createUser(userData) {
    return User.create(userData);
  },

  async updateUser(id, updateData) {
    return User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async createSocialUser(provider, email, firstName, lastName) {
    const hashedPassword = await authService.hashPassword(Math.random().toString(36));
    return this.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      socialProvider: provider
    });
  }
};