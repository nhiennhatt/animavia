import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { UserStatusEnum } from './constants';
export interface UserPayload extends jwt.JwtPayload {
  userId: string;
  status: (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
}

export interface AppUser {
  id: string;
  status: (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
}

export interface AppRequest extends Request {
  user: AppUser;
}
