import { check } from 'express-validator';

const validateAuthCredentials = () => [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const register = validateAuthCredentials();
export const login = validateAuthCredentials();

const userValidators = {
  register,
  login,
};

export default userValidators;
