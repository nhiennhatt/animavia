import { Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp() {
    await this.authService.sendRegistrationOtp('hiennhatt1804@gmail.com');
    return { message: 'oki' };
  }
}
