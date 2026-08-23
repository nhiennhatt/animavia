import Redis from 'ioredis';
import { randomInt, randomUUID } from 'crypto';
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
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

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
    timezone: string,
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
      .values({ email, password: hashedPassword, givenName, timezone })
      .onConflictDoNothing({ target: users.email });

    if (result.rowCount === 0)
      throw new HttpException('User is already existing', HttpStatus.CONFLICT);
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.db.query.users.findFirst({ where: { email } });
    if (!user) throw new UnauthorizedException();
    const result = await argon2.verify(user.password, plainPassword);
    if (!result) throw new UnauthorizedException();

    return this.assignTokenPair({ id: user.id, status: user.status });
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verifyAccessToken(token);

      const user = await this.db.query.users.findFirst({
        columns: {
          id: true,
          email: true,
          status: true,
          role: true,
          givenName: true,
          timezone: true,
        },
        where: { id: payload.userId },
      });

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      if (error instanceof SyntaxError || error instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  async regainTokenPair(token: string) {
    try {
      const payload = this.jwtService.verifyRefreshToken(token);

      if (await this.checkTokenInBlacklist(payload.jti))
        throw new ForbiddenException();

      await this.addTokenToBlackList(payload.jti);

      const user = await this.db.query.users.findFirst({
        columns: { id: true, email: true, status: true },
        where: { id: payload.userId },
      });

      if (!user) throw new ForbiddenException();

      return this.assignTokenPair({ id: user.id, status: user.status });
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

  async addTokenToBlackList(jti: string) {
    try {
      await this.redis.set(`bl:${jti}`, '1', 'EX', 172800);
    } catch (error) {
      this.logger.log('Save blacklist failed');
    }
  }

  async checkTokenInBlacklist(jti: string) {
    const exist = await this.redis.get(`bl:${jti}`);
    return !!exist;
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      await this.addTokenToBlackList(payload.jti);
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError ||
        error instanceof NotBeforeError ||
        error instanceof SyntaxError
      ) {
        throw new UnauthorizedException();
      }
    }
  }

  async exchangeGoogleToken(code: string, timezone: string) {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: process.env.GOOGLE_CLIENT_REDIRECT || '',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenResponse.json()) as
      | { error: { error_description: string }; access_token: undefined }
      | { access_token: string; error: undefined };

    if (tokenData.error) throw new UnauthorizedException();

    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    const userData = (await userResponse.json()) as {
      email: string;
      given_name: string;
    };

    const userInstance = await this.db
      .insert(users)
      .values({
        email: userData.email,
        givenName: userData.given_name,
        password: await argon2.hash(randomUUID(), {
          type: argon2.argon2id,
          memoryCost: 2 ** 17,
          parallelism: 2,
          timeCost: 4,
        }),
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          givenName: userData.given_name || '',
        },
      })
      .returning();

    return this.assignTokenPair({
      id: userInstance[0].id,
      status: userInstance[0].id,
    });
  }

  assignTokenPair(payload: { id: string; status: string }) {
    const jti = randomUUID();

    const accessToken = this.jwtService.signAccessToken(
      {
        userId: payload.id,
        status: payload.status,
      },
      jti,
    );

    const refreshToken = this.jwtService.signRefreshToken(
      { userId: payload.id },
      jti,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
