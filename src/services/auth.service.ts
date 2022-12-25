import { compare, hash } from 'bcrypt';
import userModel from '@models/users.model';
import { HttpException } from '@exceptions/HttpException';
import { AuthRequest, AuthUserToken } from '@interfaces/auth.interface';
import { User } from '@interfaces/user.interface';
import { redisClient } from '@/app';
import { checkToken, createToken, getExpireAt } from '@utils/utils';
import { REFRESH_EXPIRE } from '@config';

const users = userModel;

const register = async (userData: AuthRequest): Promise<User> => {
  const findUser: User | null = await users.findOne({ email: userData.email });
  if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

  const hashedPassword = await hash(userData.password, 10);
  const createUserData: User = await users.create({ ...userData, password: hashedPassword });

  return createUserData;
};

const login = async (userData: AuthRequest): Promise<AuthUserToken> => {
  const findUser: User | null = await users.findOne({ email: userData.email });
  if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

  const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
  if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

  const token = await createToken(findUser._id);
  await redisClient.set(`token_${token}`, findUser._id.toString());
  await redisClient.expireAt(`token_${token}`, getExpireAt(REFRESH_EXPIRE ? +REFRESH_EXPIRE : 600));

  return { token, user: findUser };
};

const logout = async (token: string): Promise<void> => {
  await redisClient.del(`token_${token}`);
};

const refresh = async (authorization: string | undefined): Promise<AuthUserToken> => {
  const { token, _id } = await checkToken(authorization);

  const findUser: User | null = await users.findById(_id);
  if (!findUser) throw new HttpException(404, 'User not found');

  const refreshToken = await createToken(_id);
  await redisClient.rename(`token_${token}`, `token_${refreshToken}`);

  return { token: refreshToken, user: findUser };
};

const authService = {
  register,
  login,
  logout,
  refresh,
};

export default authService;
