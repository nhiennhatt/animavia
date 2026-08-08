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

export const updateHabitValidation = z
  .object({
    name: z.string().min(5).max(110).optional(),
    objective: z.string().max(320).optional(),
    htype: z.enum(Object.values(HabitType)).optional(),
    domain: z
      .array(z.enum(Object.values(LifeDomains)))
      .min(1)
      .optional(),
  })
  .refine(
    ({ domain, htype, name, objective }) =>
      domain || htype || name || objective,
    {
      message: 'No values to update',
      path: [],
    },
  );

export class UpdateHabitValidation extends createZodDto(
  updateHabitValidation,
) {}
