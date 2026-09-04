import { Body, Controller, Delete, Post } from '@nestjs/common';
import AuthService from './auth.service';
import {
  ExchangeGoogleTokenSchema,
  LogoutValidationSchema,
  RefreshTokenValidation,
  SaveUserPayload,
  SendRegistrationOtpPayload,
  SignInUserValidation,
  ValidateRegistrationOtpValidation,
} from './auth.validation';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: { limit: 1, ttl: 30 * 1000 },
    long: { limit: 3, ttl: 5 * 60 * 1000 },
  })
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
      payload.givenName,
      payload.timezone,
    );

    return { message: 'Successfully' };
  }

  @Post('/token')
  async token(@Body() payload: SignInUserValidation) {
    return await this.authService.validateUser(payload.email, payload.password);
  }

  @Post('/refresh')
  async refresh(@Body() payload: RefreshTokenValidation) {
    return await this.authService.regainTokenPair(payload.token);
  }

  @Delete('/logout')
  async logout(@Body() body: LogoutValidationSchema) {
    await this.authService.logout(body.refresh);
  }

  @Post('/google')
  async exchangeGoogleToken(@Body() body: ExchangeGoogleTokenSchema) {
    return this.authService.exchangeGoogleToken(body.code, body.timezone);
  }
}
