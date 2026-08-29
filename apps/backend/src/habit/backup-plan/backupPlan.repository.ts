import { Injectable } from '@nestjs/common';
import { count, eq, getColumns } from 'drizzle-orm';
import { habitBackupPlans, habits } from '../../db/db.schema';
import Repository from '../../utils/common/Repository';

@Injectable()
export default class BackupPlanRepository extends Repository {
  async count(habitId: string) {
    const result = await this.txHost.tx
      .select({ amount: count(habitBackupPlans.id) })
      .from(habitBackupPlans)
      .where(eq(habitBackupPlans.habitId, habitId));

    return result[0].amount;
  }

  createNewBackupPlan(data: typeof habitBackupPlans.$inferInsert) {
    return this.txHost.tx.insert(habitBackupPlans).values(data).returning();
  }

  getBackupPlans(habitId: string) {
    return this.txHost.tx.query.habitBackupPlans.findMany({
      where: {
        habitId,
      },
    });
  }

  async checkOwnBackupPlan(backupPlanId: string, userId: string) {
    const backupPlan = this.txHost.tx
      .select({
        habitId: habitBackupPlans.habitId,
      })
      .from(habitBackupPlans)
      .where(eq(habitBackupPlans.id, backupPlanId))
      .as('backup_plan');

    const joinedHabit = await this.txHost.tx
      .select({
        ...getColumns(backupPlan),
        userId: habits.ownerId,
      })
      .from(backupPlan)
      .leftJoin(habits, eq(backupPlan.habitId, habits.id))
      .where(eq(habits.ownerId, userId));

    return !!(joinedHabit && joinedHabit.length > 0);
  }

  deleteBackupPlan(backupPlanId: string) {
    return this.txHost.tx
      .delete(habitBackupPlans)
      .where(eq(habitBackupPlans.id, backupPlanId));
  }

  updateBackupPlan(
    backupId: string,
    set: Partial<typeof habitBackupPlans.$inferInsert>,
  ) {
    return this.txHost.tx
      .update(habitBackupPlans)
      .set(set)
      .where(eq(habitBackupPlans.id, backupId))
      .returning();
  }
}
