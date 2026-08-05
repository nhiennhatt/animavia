import { Body, Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';
import {
  SendRegistrationOtpPayload,
  ValidateRegistrationOtpValidation,
} from './auth.validation';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register/send-otp')
  async sendRegisterOtp(@Body() payload: SendRegistrationOtpPayload) {
    await this.authService.sendRegistrationOtp(payload.email);
    return { message: 'oki' };
  }

  @Post('/register/validate-otp')
  async validateRegisterOtp(
    @Body() payload: ValidateRegistrationOtpValidation,
  ) {
    const registrationToken = await this.authService.validationRegistrationOtp(
      payload.email,
      payload.otp,
    );

    return { token: registrationToken };
  }
}
