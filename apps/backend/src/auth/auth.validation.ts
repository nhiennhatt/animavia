import { createZodDto } from 'nestjs-zod';
import z from 'zod';

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
});

export class SaveUserPayload extends createZodDto(saveUserValidation) {}

export const signInUserValidation = z.object({
  email: z.email(),
  password: z.string().min(9),
});

export class SignInUserValidation extends createZodDto(signInUserValidation) {}

export const refreshTokenValidation = z.object({
  token: z.jwt(),
});

export class RefreshTokenValidation extends createZodDto(
  refreshTokenValidation,
) {}
