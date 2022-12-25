import { User } from '@interfaces/user.interface';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse<T> {
  user: T;
}

export interface Token {
  token: string;
}

export interface AuthUserToken<T = User> extends AuthResponse<T>, Token {}
