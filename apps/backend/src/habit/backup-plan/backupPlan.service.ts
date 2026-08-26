import { and, count, eq, getColumns } from 'drizzle-orm';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  habitBackupPlans,
  habits,
  type AppPgDatabaseType,
} from '../../db/db.schema';

@Injectable()
export default class BackupPlanService {
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async createBackupPlan(
    habitId: string,
    ifCase: string,
    then: string,
    userId: string,
  ) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, userId)));

    if (!habit || habit.length === 0) throw new NotFoundException();

    const opetationResult = await this.db.transaction(async (tx) => {
      const currentAmount = await tx
        .select({ amount: count(habitBackupPlans.id) })
        .from(habitBackupPlans)
        .where(eq(habitBackupPlans.habitId, habitId));

      if (currentAmount && currentAmount[0] && currentAmount[0].amount >= 5) {
        throw new BadRequestException('OUT_OF_LIMIT');
      }

      const instance = await tx
        .insert(habitBackupPlans)
        .values({ habitId, ifCase, then })
        .returning();

      return instance;
    });

    if (opetationResult.length === 0) throw new InternalServerErrorException();

    return opetationResult[0];
  }

  async getBackupPlans(userId: string, habitId: string) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, userId)));

    if (!habit || habit.length === 0) throw new NotFoundException();

    return await this.db.query.habitBackupPlans.findMany({
      where: {
        habitId,
      },
    });
  }

  async deleteBackupPlan(userId: string, backupPlanId: string) {
    const backupPlan = this.db
      .select()
      .from(habitBackupPlans)
      .where(eq(habitBackupPlans.id, backupPlanId))
      .as('backup_plan');

    const joinedHabit = await this.db
      .select({
        ...getColumns(backupPlan),
        userId: habits.ownerId,
      })
      .from(backupPlan)
      .leftJoin(habits, eq(backupPlan.habitId, habits.id));

    if (!joinedHabit || !joinedHabit[0] || joinedHabit[0].userId !== userId)
      throw new NotFoundException();

    const deleteOperation = await this.db
      .delete(habitBackupPlans)
      .where(eq(habitBackupPlans.id, backupPlanId));

    return deleteOperation.rowCount;
  }

  async updateBackupPlan(
    userId: string,
    backupPlanId: string,
    set: { ifCase: string; then: string },
  ) {
    const backupPlan = this.db
      .select()
      .from(habitBackupPlans)
      .where(eq(habitBackupPlans.id, backupPlanId))
      .as('backup_plan');

    const joinedHabit = await this.db
      .select({
        ...getColumns(backupPlan),
        userId: habits.ownerId,
      })
      .from(backupPlan)
      .leftJoin(habits, eq(backupPlan.habitId, habits.id));

    if (!joinedHabit || !joinedHabit[0] || joinedHabit[0].userId !== userId)
      throw new NotFoundException();

    const updateOperation = await this.db
      .update(habitBackupPlans)
      .set(set)
      .returning();

    if (!updateOperation || !updateOperation[0])
      throw new InternalServerErrorException();

    return updateOperation[0];
  }
}
