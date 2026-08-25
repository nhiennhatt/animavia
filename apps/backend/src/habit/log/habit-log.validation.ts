import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const addHabitLogSchema = z.object({
  habitId: z.uuid(),
  date: z.uint32(),
  thought: z.string().trim().max(350).optional(),
});

export class AddHabitLogSchema extends createZodDto(addHabitLogSchema) {}

export const getHabitLogParamsSchema = z.object({
  habit_id: z.uuid(),
  period: z.enum(['w', 'm']).optional().default('w'),
  time: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(() => Math.trunc(new Date().getTime() / 1000)),
});

export class GetHabitLogParamsSchema extends createZodDto(
  getHabitLogParamsSchema,
) {}
