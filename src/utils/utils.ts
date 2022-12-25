import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY, TOKEN_EXPIRE } from '@/config';
import { redisClient } from '@/app';
import { HttpException } from '@exceptions/HttpException';
import { Token } from '@interfaces/auth.interface';

export const validate = (schemas: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(schemas.map(schema => schema.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    return next();
  };
};

export const createToken = async (_id: string): Promise<string> => {
  const dataStoredInToken = { _id };
  const secretKey: string | undefined = SECRET_KEY;
  const expiresIn: number | undefined = Number(TOKEN_EXPIRE);

  if (!secretKey) throw new HttpException(404, 'Secret key not found');
  if (!expiresIn) throw new HttpException(404, 'Expires in not found');

  return sign(dataStoredInToken, secretKey, { expiresIn, algorithm: 'HS512' });
};

export const checkToken = async (authorization: string | undefined): Promise<Token & { _id: string }> => {
  const token = authorization && authorization.split(' ')[1];
  if (!token) throw new HttpException(404, `jwt token missing`);

  const _id = await redisClient.get(`token_${token}`);
  if (!_id) throw new HttpException(401, 'jwt not authorized');

  return { token, _id };
};

export const getExpireAt = (seconds: number) => {
  return Math.floor(new Date().getTime() / 1000) + seconds;
};
