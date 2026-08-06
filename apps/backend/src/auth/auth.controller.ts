import { Body, Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';
import {
  SaveUserPayload,
  SendRegistrationOtpPayload,
  SignInUserValidation,
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

  @Post('/register')
  async register(@Body() payload: SaveUserPayload) {
    await this.authService.saveUser(
      payload.email,
      payload.password,
      payload.registrationToken,
    );

    return { message: 'Successfully' };
  }

  @Post('/signin')
  async signin(@Body() payload: SignInUserValidation) {
    return await this.authService.validateUser(payload.email, payload.password);
  }
}
