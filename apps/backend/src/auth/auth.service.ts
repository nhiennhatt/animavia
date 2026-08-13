import Redis from 'ioredis';
import { createHash, randomInt } from 'crypto';
import { ClientProxy } from '@nestjs/microservices';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import argon2 from 'argon2';
import { users, type AppPgDatabaseType } from '../db/db.schema';
import { JwtService } from './jwt.service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('DB') private readonly db: AppPgDatabaseType,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async sendRegistrationOtp(email: string) {
    const user = await this.db.query.users.findFirst({
      columns: { id: true },
      where: {
        email,
      },
    });

    if (user)
      throw new HttpException(
        'Email is already existing',
        HttpStatus.BAD_REQUEST,
      );

    const otp = randomInt(Math.pow(10, 5), Math.pow(10, 6));
    await this.redis.set(`registration-otp:${otp}`, email, 'EX', 600);
    this.emailService.emit('registration-otp', { otp, email });
  }

  async validationRegistrationOtp(email: string, otp: string) {
    const storedEmail = await this.redis.getdel(`registration-otp:${otp}`);
    if (storedEmail !== email)
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);

    const user = await this.db.query.users.findFirst({
      columns: { id: true },
      where: {
        email,
      },
    });

    if (user) throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);

    const registrationToken = crypto.randomUUID();
    await this.redis.set(
      `registration-token:${registrationToken}`,
      email,
      'EX',
      600,
    );
    return registrationToken;
  }

  async saveUser(
    email: string,
    rawPassword: string,
    registrationToken: string,
    givenName: string,
  ) {
    const storedEmail = await this.redis.getdel(
      `registration-token:${registrationToken}`,
    );

    if (storedEmail !== email)
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    const hashedPassword = await argon2.hash(rawPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 17,
      parallelism: 2,
      timeCost: 4,
    });

    const result = await this.db
      .insert(users)
      .values({ email, password: hashedPassword, givenName })
      .onConflictDoNothing({ target: users.email });

    if (result.rowCount === 0)
      throw new HttpException('User is already existing', HttpStatus.CONFLICT);
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.db.query.users.findFirst({ where: { email } });
    if (!user) throw new UnauthorizedException();
    const result = await argon2.verify(user.password, plainPassword);
    if (!result) throw new UnauthorizedException();

    const accessToken = this.jwtService.signAccessToken({
      userId: user.id,
      status: user.status,
    });

    const refreshToken = this.jwtService.signRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      if (await this.checkTokenInBlacklist(token))
        throw new ForbiddenException();

      const payload = this.jwtService.verifyAccessToken(token);

      const user = await this.db.query.users.findFirst({
        columns: {
          id: true,
          email: true,
          status: true,
          role: true,
          givenName: true,
        },
        where: { id: payload.userId },
      });

      if (!user) throw new ForbiddenException();

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('TOKEN_EXPIRED');
      }
      if (error instanceof SyntaxError || error instanceof JsonWebTokenError) {
        throw new ForbiddenException();
      }

      throw error;
    }
  }

  async regainTokenPair(token: string) {
    try {
      if (await this.checkTokenInBlacklist(token))
        throw new ForbiddenException();

      const payload = this.jwtService.verifyRefreshToken(token);

      const user = await this.db.query.users.findFirst({
        columns: { id: true, email: true, status: true },
        where: { id: payload.userId },
      });

      if (!user) throw new ForbiddenException();

      const accessToken = this.jwtService.signAccessToken({
        userId: user.id,
        status: user.status,
      });

      const refreshToken = this.jwtService.signRefreshToken({
        userId: user.id,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      if (
        error instanceof SyntaxError ||
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new ForbiddenException();
      }

      throw error;
    }
  }

  async addTokenToBlackList(token: string, type: 'access' | 'refresh') {
    try {
      const verifiedData =
        type === 'access'
          ? this.jwtService.verifyAccessToken(token)
          : this.jwtService.verifyRefreshToken(token);

      const hashedToken = createHash('sha256').update(token).digest('hex');

      if (verifiedData)
        await this.redis.set(
          `bl:${hashedToken}`,
          '1',
          'EX',
          type === 'access' ? 21600 : 172800,
        );
    } catch (error) {
      this.logger.log('Save blacklist failed');
    }
  }

  async checkTokenInBlacklist(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const exist = await this.redis.get(`bl:${hashedToken}`);
    return !!exist;
  }

  async logout(token: string, refreshToken: string) {
    await Promise.allSettled([
      this.addTokenToBlackList(token, 'access'),
      this.addTokenToBlackList(refreshToken, 'refresh'),
    ]);
  }
}
