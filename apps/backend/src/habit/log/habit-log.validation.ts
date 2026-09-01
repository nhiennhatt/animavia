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
  period: z.enum(['w', 'M']).optional().default('w'),
  time: z.uint32(),
});

export class GetHabitLogParamsSchema extends createZodDto(
  z.compile(getHabitLogParamsSchema),
) {}
