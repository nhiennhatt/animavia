import jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { UserPayload } from '../utils/types';

@Injectable()
export class JwtService {
  private readonly ALGO = 'RS256';
  constructor(
    @Inject('ACCESS_PRIVATE_KEY') private readonly accessPrivateKey: string,
    @Inject('ACCESS_PUBLIC_KEY') private readonly accessPublicKey: string,
    @Inject('REFRESH_PRIVATE_KEY') private readonly refreshPrivateKey: string,
    @Inject('REFRESH_PUBLIC_KEY') private readonly refreshPublicKey: string,
  ) {}

  private sign(payload: object, privateKey: string, exInMin: number) {
    return jwt.sign(payload, privateKey, {
      algorithm: this.ALGO,
      expiresIn: `${exInMin}min`,
    });
  }

  private verify<T extends jwt.JwtPayload>(
    token: string,
    publicKey: string,
  ): T {
    return jwt.verify(token, publicKey, {
      algorithms: [this.ALGO],
    }) as T;
  }

  signAccessToken(payload: object) {
    return this.sign(payload, this.accessPrivateKey, 2);
  }

  signRefreshToken(payload: object) {
    return this.sign(payload, this.refreshPrivateKey, 7200);
  }

  verifyAccessToken(token: string): UserPayload {
    return this.verify(token, this.accessPublicKey);
  }

  verifyRefreshToken(token: string): Pick<UserPayload, 'userId'> {
    return this.verify(token, this.refreshPublicKey);
  }
}
