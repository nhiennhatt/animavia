import jwt from 'jsonwebtoken';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtService {
  private readonly ALGO = 'RS256';

  sign(payload: object, privateKey: string, exInMin: number) {
    return jwt.sign(payload, privateKey, {
      algorithm: this.ALGO,
      expiresIn: `${exInMin}min`,
    });
  }

  verify(token: string, publicKey: string) {
    return jwt.verify(token, publicKey, {
      algorithms: [this.ALGO],
    });
  }
}
