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

export const updateHabitValueSchema = z.object({
  name: z.string().nonempty().max(70).trim(),
  value: z.string().nonempty().max(180).trim(),
});

export class UpdateHabitValueSchema extends createZodDto(
  z.compile(updateHabitValueSchema),
) {}
