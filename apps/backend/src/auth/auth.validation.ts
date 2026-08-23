import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { createTimezoneSchemas } from 'zod-timezone-validation';

const { CoercedCanonicalTimezoneSchema } = createTimezoneSchemas();

export const sendRegistrationOtpValidation = z.object({
  email: z.email(),
});

export class SendRegistrationOtpPayload extends createZodDto(
  sendRegistrationOtpValidation,
) {}

export const validateRegistrationOtpValidation = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export class ValidateRegistrationOtpValidation extends createZodDto(
  validateRegistrationOtpValidation,
) {}

export const saveUserValidation = z.object({
  email: z.email(),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{9,}$/),
  registrationToken: z.uuid(),
  givenName: z.string().min(3).max(75),
  timezone: CoercedCanonicalTimezoneSchema.default(() =>
    CoercedCanonicalTimezoneSchema.parse('Asia/Ho_Chi_Minh'),
  ),
});

export class SaveUserPayload extends createZodDto(saveUserValidation) {}

export const signInUserValidation = z.object({
  email: z.email(),
  password: z.string().min(9),
});

export class SignInUserValidation extends createZodDto(signInUserValidation) {}

export const refreshTokenValidation = z.object({
  token: z.string(),
});

export class RefreshTokenValidation extends createZodDto(
  refreshTokenValidation,
) {}

export const logoutValidationSchema = z.object({
  refresh: z.string(),
});

export class LogoutValidationSchema extends createZodDto(
  logoutValidationSchema,
) {}

export const exchangeGoogleTokenSchema = z.object({
  code: z.string(),
  timezone: CoercedCanonicalTimezoneSchema.default(() =>
    CoercedCanonicalTimezoneSchema.parse('Asia/Ho_Chi_Minh'),
  ),
});

export class ExchangeGoogleTokenSchema extends createZodDto(
  exchangeGoogleTokenSchema,
) {}
