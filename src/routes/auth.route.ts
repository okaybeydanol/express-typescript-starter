import { Router } from 'express';
import authController from '@controllers/auth.controller';
import userValidators from '@validators/auth.validator';
import authMiddleware from '@middlewares/auth.middleware';
import { validate } from '@utils/utils';

const path = '/auth/';
const AuthRoute = Router();

AuthRoute.post(`${path}register`, validate(userValidators.register), authController.register);
AuthRoute.post(`${path}login`, validate(userValidators.login), authController.login);
AuthRoute.post(`${path}logout`, authMiddleware, authController.logout);
AuthRoute.post(`${path}refresh`, authController.refresh);

export default AuthRoute;
