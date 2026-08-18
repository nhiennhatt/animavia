import { HabitTypeEnum, LifeDomainEnum } from "@/helpers/constants";
import z from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(3).max(110),
  objective: z.string().max(320).optional(),
  htype: z.enum(Object.values(HabitTypeEnum)),
  domain: z.array(z.enum(Object.values(LifeDomainEnum))).min(1),
  weekly: z.int().min(1).max(7),
});

export interface CreateHabitSchema extends z.infer<typeof createHabitSchema> {}

export const createHabitStatementSchema = z.object({
  habitId: z.uuid(),
  statement: z.string().min(4).max(240).nonempty(),
  source: z.string().max(110).optional(),
});

export interface CreateHabitStatementSchema extends z.infer<
  typeof createHabitStatementSchema
> {}

export const steppedCreateHabitSchema = createHabitSchema.extend({
  statement: createHabitStatementSchema.omit({ habitId: true }).optional(),
});

export interface SteppedCreateHabitSchema extends z.infer<
  typeof steppedCreateHabitSchema
> {}

export const getHabitsSchema = z.object({
  page: z.int().min(1).max(10).optional().default(1),
  size: z.int().min(1).max(10).optional().default(5),
  withRandomQuote: z.boolean().optional().default(false),
});

export interface GetHabitsSchema extends z.infer<typeof getHabitsSchema> {}
