import * as jwt from 'jsonwebtoken';
import { Customer } from '../customers/entities/customer.entity';
import { JwtPayloadInterface } from 'src/types/common';
import { JWT_SECRET } from './constants';

export const generateToken = (customer: Partial<Customer>): string => {
  const payload: JwtPayloadInterface = {
    id: customer?.id,
    email: customer?.email,
    name: customer?.name,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): JwtPayloadInterface => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayloadInterface;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
