import z from 'zod';
import { HabitType, LifeDomains } from '../../utils/constants';
import { createZodDto } from 'nestjs-zod';

export const generateHabitValidation = z.object({
  name: z.string().min(5).max(110),
  objective: z.string().max(320).optional(),
  htype: z.enum(Object.values(HabitType)),
  domain: z.array(z.enum(Object.values(LifeDomains))).min(1),
  weeklyGoal: z.int().min(1).max(7).default(7).optional(),
  pinned: z.boolean().default(false),
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
    pinned: z.boolean().optional(),
    weeklyGoal: z.int().min(1).max(7).optional(),
  })
  .refine(
    ({ domain, htype, name, objective, pinned, weeklyGoal }) =>
      domain || htype || name || objective || pinned || weeklyGoal,
    {
      message: 'No values to update',
      path: [],
    },
  );

export class UpdateHabitValidation extends createZodDto(
  updateHabitValidation,
) {}

export const getOwnedHabitSchema = z.object({
  size: z.coerce.number().int().min(1).max(10).default(5),
  cursor: z.uuid().optional(),
  htype: z.enum(Object.values(HabitType)).optional(),
  cursorDatetime: z.iso
    .datetime()
    .transform((e) => new Date(e))
    .optional(),
  pinned: z.coerce.number().int().min(0).max(1).optional(),
});

export class GetOwnedHabitSchema extends createZodDto(getOwnedHabitSchema) {}
