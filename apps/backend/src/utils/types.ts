import jwt from 'jsonwebtoken';
export interface UserPayload extends jwt.JwtPayload {
  userId: string;
  status: string;
}
