import Redis from 'ioredis';
import { randomInt } from 'crypto';
import { ClientProxy } from '@nestjs/microservices';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { type AppPgDatabaseType } from '../db/db.schema';

@Injectable()
export default class AuthService {
  constructor(
    @Inject('DB') private readonly db: AppPgDatabaseType,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy,
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
}
