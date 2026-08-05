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
});

export class SaveUserPayload extends createZodDto(saveUserValidation) {}
