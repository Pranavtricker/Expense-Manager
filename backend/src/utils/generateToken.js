// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};