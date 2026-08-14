import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createStatementSchema = z.object({
  statement: z.string().max(250).nonempty(),
  source: z.string().max(110).optional(),
  habitId: z.uuid(),
});

export class CreateStatementSchema extends createZodDto(
  createStatementSchema,
) {}

const getStatementsByHabitSchema = z.object({
  habitId: z.uuid(),
  pageSize: z.coerce.number().int().max(10).min(1).default(5),
  page: z.coerce.number().int().max(15).min(1).default(1),
});

export class GetStatementsByHabitSchema extends createZodDto(
  getStatementsByHabitSchema,
) {}

export const updateStatementSchema = z.object({
  statement: z.string().max(250).nonempty().optional(),
  source: z.string().max(110).optional(),
});

export class UpdateStatementSchema extends createZodDto(
  updateStatementSchema,
) {}
