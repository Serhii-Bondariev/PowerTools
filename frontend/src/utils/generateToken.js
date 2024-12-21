// src/utils/generateToken.js
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};
