import { Body, Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';
import { SendRegistrationOtpPayload } from './auth.validation';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() payload: SendRegistrationOtpPayload) {
    await this.authService.sendRegistrationOtp(payload.email);
    return { message: 'oki' };
  }
}
