import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('registration-otp')
  async getHello(
    @Payload() data: { otp: string; email: string },
    @Ctx() context: RedisContext,
  ) {
    await this.appService.sendOtp(data.email, data.otp);
  }
}
