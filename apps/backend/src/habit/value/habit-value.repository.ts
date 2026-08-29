import { Injectable } from '@nestjs/common';
import { habitValues } from '../../db/db.schema';
import { count, eq } from 'drizzle-orm';
import Repository from '../../utils/common/Repository';

@Injectable()
export default class HabitValueRepository extends Repository {
  async countHabitValue(habitId: string) {
    const result = await this.txHost.tx
      .select({ amount: count(habitValues.id) })
      .from(habitValues)
      .where(eq(habitValues.habitId, habitId));

    return result[0].amount;
  }

  createNewHabitValue(payload: typeof habitValues.$inferInsert) {
    return this.txHost.tx.insert(habitValues).values(payload).returning();
  }

  getHabitValues(habitId: string) {
    return this.txHost.tx
      .select()
      .from(habitValues)
      .where(eq(habitValues.habitId, habitId));
  }
}
