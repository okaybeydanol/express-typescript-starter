import { NextFunction, Request } from 'express';
import authService from '@services/auth.service';
import userResource from '@resources/user.resource';
import { TypedRequestBody, TypedResponse } from '@interfaces/exchange.interface';
import { AuthResponse, AuthRequest, AuthUserToken } from '@interfaces/auth.interface';
import { UserResponse } from '@interfaces/user.interface';

const register = async (req: TypedRequestBody<AuthRequest>, res: TypedResponse<AuthResponse<UserResponse>>, next: NextFunction) => {
  try {
    const userData = req.body;
    const data = await authService.register(userData);
    const userJson = await userResource.userJson(data);

    res.status(201).json({ data: { user: userJson }, message: 'Successfully registered.' });
  } catch (error) {
    next(error);
  }
};

const login = async (req: TypedRequestBody<AuthRequest>, res: TypedResponse<AuthUserToken<UserResponse>>, next: NextFunction) => {
  try {
    const userData = req.body;
    const data = await authService.login(userData);
    const userJson = await userResource.userJson(data.user);

    res.status(200).json({ data: { user: userJson, token: data.token }, message: 'Successfully logged in.' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: TypedRequestBody<AuthUserToken>, res: TypedResponse<null>, next: NextFunction) => {
  try {
    const token = req.body.token;
    await authService.logout(token);

    res.status(200).json({ data: null, message: 'Successfully logged out.' });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req: Request, res: TypedResponse<AuthUserToken<UserResponse>>, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    const data = await authService.refresh(authorization);
    const userJson = await userResource.userJson(data.user);

    res.status(200).json({ data: { user: userJson, token: data.token }, message: 'Successfully refreshing token.' });
  } catch (error) {
    next(error);
  }
};

const authController = {
  register,
  login,
  logout,
  refresh,
};

export default authController;
