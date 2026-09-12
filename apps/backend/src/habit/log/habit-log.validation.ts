import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const addHabitLogSchema = z.object({
  habitId: z.uuid(),
  date: z.uint32(),
});

export class AddHabitLogSchema extends createZodDto(
  z.compile(addHabitLogSchema),
) {}

export const getHabitLogParamsSchema = z.object({
  habit_id: z.uuid(),
  period: z.enum(['d', 'w', 'M']).optional().default('d'),
  time: z.coerce.number().int().positive(),
});

export class GetHabitLogParamsSchema extends createZodDto(
  getHabitLogParamsSchema,
) {}
