import { Injectable } from '@nestjs/common';
import Repository from '../../utils/common/Repository';
import { habitLogs } from '../../db/db.schema';
import { and, between, eq, getColumns, isNotNull, ne, sql } from 'drizzle-orm';

@Injectable()
export default class HabitLogRepository extends Repository {
  async checkAlreadyExistLogInDate(
    habitId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const startUnix = Math.trunc(startDate.getTime() / 1000);
    const endUnix = Math.trunc(endDate.getTime() / 1000);

    const result = await this.txHost.tx
      .select({ id: habitLogs.id })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          between(
            habitLogs.forDate,
            sql`to_timestamp(${startUnix})`,
            sql`to_timestamp(${endUnix})`,
          ),
        ),
      );

    return !!(result && result.length > 0);
  }

  insertNewLog(data: typeof habitLogs.$inferInsert) {
    return this.txHost.tx.insert(habitLogs).values(data).returning();
  }

  getLogs(
    habitId: string,
    startDate: Date,
    endDate: Date,
    hasThoughtOnly: boolean = false,
  ) {
    const startUnix = Math.trunc(startDate.getTime() / 1000);
    const endUnix = Math.trunc(endDate.getTime() / 1000);

    return this.txHost.tx
      .select({
        ...getColumns(habitLogs),
        forDate: sql<number>`EXTRACT(EPOCH FROM ${habitLogs.forDate})::INTEGER`,
      })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          ...(hasThoughtOnly
            ? [
                isNotNull(habitLogs.thought),
                ne(sql`TRIM(${habitLogs.thought})`, ''),
              ]
            : []),
          between(
            habitLogs.forDate,
            sql`to_timestamp(${startUnix})`,
            sql`to_timestamp(${endUnix})`,
          ),
        ),
      );
  }

  async isLoggedByDate(habitId: string, startDate: Date, endDate: Date) {
    const startUnix = Math.trunc(startDate.getTime() / 1000);
    const endUnix = Math.trunc(endDate.getTime() / 1000);

    const result = await this.txHost.tx
      .select({ id: habitLogs.id })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          between(
            habitLogs.forDate,
            sql`TO_TIMESTAMP(${startUnix})`,
            sql`TO_TIMESTAMP(${endUnix})`,
          ),
        ),
      );

    return !!(result && result.length > 0);
  }
}
