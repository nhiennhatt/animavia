import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const getHabitThought = z.object({
  habitId: z.uuid(),
  time: z.coerce.number().int().positive(),
  unitTime: z.enum(['w', 'M', 'd']).default('d'),
});

export class GetHabitThoughtSchema extends createZodDto(getHabitThought) {}

export const addHabitThought = z.object({
  habitId: z.uuid(),
  thought: z.string().trim().nonempty().max(350),
  forDate: z.int32().positive(),
});

export class AddHabitThoughtSchema extends createZodDto(
  z.compile(addHabitThought),
) {}

export const updateHabitThought = z.object({
  thought: z.string().trim().nonempty().max(350),
});

export class UpdateHabitThoughtSchema extends createZodDto(
  z.compile(updateHabitThought),
) {}
