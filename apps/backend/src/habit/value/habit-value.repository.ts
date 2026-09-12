import { Injectable } from '@nestjs/common';
import { habits, habitValues } from '../../db/db.schema';
import { count, eq, getColumns } from 'drizzle-orm';
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

  updateHabitValue(id: string, name: string, value: string) {
    return this.txHost.tx
      .update(habitValues)
      .set({
        name,
        value,
      })
      .where(eq(habitValues.id, id))
      .returning();
  }

  getHabitValueById(id: string) {
    return this.txHost.tx
      .select()
      .from(habitValues)
      .where(eq(habitValues.id, id));
  }

  getHabitValueByIdAndUserId(id: string, userId: string) {
    const statement = this.getHabitValueById(id).as('value');

    return this.txHost.tx
      .select(getColumns(statement))
      .from(statement)
      .leftJoin(habits, eq(habits.id, statement.habitId))
      .where(eq(habits.ownerId, userId));
  }

  deleteHabitValue(id: string) {
    return this.txHost.tx.delete(habitValues).where(eq(habitValues.id, id));
  }
}
