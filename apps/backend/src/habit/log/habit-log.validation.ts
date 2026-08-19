import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const addHabitLogSchema = z.object({
  habitId: z.uuid(),
  date: z.uint32(),
  thought: z.string().max(350).optional(),
});

export class AddHabitLogSchema extends createZodDto(addHabitLogSchema) {}
