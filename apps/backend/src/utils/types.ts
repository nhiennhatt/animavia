import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { UserRoleEnum, UserStatusEnum } from './constants';
export interface UserPayload
  extends Omit<jwt.JwtPayload, 'jti'>, Required<Pick<jwt.JwtPayload, 'jti'>> {
  userId: string;
  status: (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
}

export interface AppUser {
  id: string;
  status: (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
  role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
  givenName: string;
  email: string;
  timezone: string;
}

export interface AppRequest extends Request {
  user: AppUser;
}

export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
