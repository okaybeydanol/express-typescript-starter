import { check } from 'express-validator';

export const register = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const login = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const userValidators = {
  register,
  login,
};

export default userValidators;
