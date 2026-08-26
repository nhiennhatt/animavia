import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createHabitValueSchema = z.object({
  name: z.string().nonempty().max(70).trim(),
  value: z.string().nonempty().max(180).trim(),
  habitId: z.uuid(),
});

export class CreateHabitValueSchema extends createZodDto(
  createHabitValueSchema,
) {}
