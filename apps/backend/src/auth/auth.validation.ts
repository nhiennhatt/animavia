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
