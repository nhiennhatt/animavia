import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createBackupPlanSchema = z.object({
  ifCase: z.string().nonempty().max(150).trim(),
  then: z.string().nonempty().max(150).trim(),
  habitId: z.uuid(),
});

export class CreateBackupPlanSchema extends createZodDto(
  createBackupPlanSchema,
) {}

export const updateBackupPlanSchema = createBackupPlanSchema.pick({
  ifCase: true,
  then: true,
});

export class UpdateBackupPlanSchema extends createZodDto(
  updateBackupPlanSchema,
) {}
