import { Injectable } from '@nestjs/common';
import Repository from '../../utils/common/Repository';
import { habitLogs } from '../../db/db.schema';
import { and, between, eq, getColumns, isNotNull, ne, sql } from 'drizzle-orm';

@Injectable()
export default class HabitLogRepository extends Repository {
  log(
    data: Omit<typeof habitLogs.$inferInsert, 'forDate'> & { forDate: number },
  ) {
    return this.txHost.tx
      .insert(habitLogs)
      .values({
        ...data,
        forDate: sql`to_timestamp(${data.forDate})`,
      })
      .onConflictDoNothing({
        target: [habitLogs.habitId, habitLogs.forDate],
      })
      .returning();
  }

  getLogs(habitId: string, startDate: number, endDate: number) {
    return this.txHost.tx
      .select({
        ...getColumns(habitLogs),
        forDate: sql<number>`EXTRACT(EPOCH FROM ${habitLogs.forDate})::INTEGER`,
      })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          between(
            habitLogs.forDate,
            sql`to_timestamp(${startDate})`,
            sql`to_timestamp(${endDate})`,
          ),
        ),
      );
  }

  async isLoggedByDate(habitId: string, startDate: number, endDate: number) {
    const result = await this.txHost.tx
      .select({ id: habitLogs.id })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          between(
            habitLogs.forDate,
            sql`TO_TIMESTAMP(${startDate})`,
            sql`TO_TIMESTAMP(${endDate})`,
          ),
        ),
      );

    return !!(result && result.length > 0);
  }

  deleteLogByHabitIdAndForDate(habitId: string, date: number) {
    return this.txHost.tx
      .delete(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          eq(habitLogs.forDate, sql`to_timestamp(${date})`),
        ),
      );
  }
}
