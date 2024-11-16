import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, secret, {
    expiresIn: '10h',
  });
};


