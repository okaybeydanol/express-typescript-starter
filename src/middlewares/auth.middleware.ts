import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import userModel from '@models/users.model';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { AuthUserToken } from '@interfaces/auth.interface';
import { TypedRequestBody } from '@interfaces/exchange.interface';
import { User } from '@interfaces/user.interface';
import { checkToken, verifyToken } from '@utils/utils';

const authMiddleware = async (req: TypedRequestBody<AuthUserToken>, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    const { token } = await checkToken(authorization);

    const secretKey: string | undefined = SECRET_KEY;
    if (!secretKey) return next(new HttpException(404, 'Secret key not found'));

    verify(token, secretKey, {}, async () => {
      try {
        const payload = await verifyToken(token, secretKey);

        const findUser: User | null = await userModel.findById(payload._id);
        if (!findUser) return next(new HttpException(404, 'User not found'));

        req.body.token = token;
        req.body.user = findUser;
        next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
