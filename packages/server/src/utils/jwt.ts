import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.jwtRefreshSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, env.jwtSecret) as { id: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as { id: string };
  } catch (error) {
    return null;
  }
};
