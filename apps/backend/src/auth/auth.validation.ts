import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const sendRegistrationOtpValidation = z.object({
  email: z.email(),
});

export class SendRegistrationOtpPayload extends createZodDto(
  sendRegistrationOtpValidation,
) {}
