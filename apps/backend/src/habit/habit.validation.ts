import z from 'zod';
import { HabitType, LifeDomains } from '../utils/constants';
import { createZodDto } from 'nestjs-zod';

export const generateHabitValidation = z.object({
  name: z.string().min(5).max(110),
  objective: z.string().max(320).optional(),
  htype: z.enum(Object.values(HabitType)),
  domain: z.array(z.enum(Object.values(LifeDomains))).min(1),
});

export class GenerateHabitValidation extends createZodDto(
  generateHabitValidation,
) {}
