import { Injectable } from '@nestjs/common';
import {
  and,
  count,
  eq,
  getColumns,
  sql,
  SQL,
  inArray,
  between,
} from 'drizzle-orm';
import { habitLogs, habits, habitStatements } from '../../db/db.schema';
import { HabitType } from '../../utils/constants';
import Repository from '../../utils/common/Repository';

@Injectable()
export default class HabitRepository extends Repository {
  async checkAlreadyExistingHabit(habitId: string, ownerId: string) {
    const result = await this.txHost.tx
      .select({ exist: sql<number>`1` })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, ownerId)));

    return result && result.length > 0;
  }

  async countHabitAmountOfUser(
    ownerId: string,
    options?: {
      size?: number;
      page?: number;
      htype?: (typeof HabitType)[keyof typeof HabitType];
      pinned?: boolean;
    },
  ): Promise<number> {
    const conditions: SQL[] = [eq(habits.ownerId, ownerId)];

    if (options) {
      if (options.htype) {
        conditions.push(eq(habits.htype, options.htype));
      }

      if (options.pinned !== undefined) {
        conditions.push(eq(habits.pinned, options.pinned));
      }
    }

    const result = await this.txHost.tx
      .select({ count: count(habits.id) })
      .from(habits)
      .where(and(...conditions));

    return result[0].count;
  }

  createNewHabit(
    data: typeof habits.$inferInsert,
  ): Promise<(typeof habits.$inferSelect)[]> {
    return this.txHost.tx
      .insert(habits)
      .values({
        htype: data.htype,
        domain: data.domain,
        name: data.name,
        objective: data.objective,
        pinned: data.pinned,
        weeklyGoal: data.weeklyGoal,
        ownerId: data.ownerId,
      })
      .returning();
  }

  updateHabitByIdAndOwnerId(
    id: string,
    ownerId: string,
    payload: Partial<typeof habits.$inferInsert>,
  ): Promise<(typeof habits.$inferSelect)[]> {
    return this.txHost.tx
      .update(habits)
      .set(payload)
      .where(and(eq(habits.id, id), eq(habits.ownerId, ownerId)))
      .returning();
  }

  getHabitByIdOwnerId(
    id: string,
    ownerId: string,
  ): Promise<(typeof habits.$inferSelect)[]> {
    return this.txHost.tx
      .select()
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.ownerId, ownerId)));
  }

  deleteHabitByIdAndOwnerId(id: string, ownerId: string) {
    return this.txHost.tx
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.ownerId, ownerId)));
  }

  getHabits(
    ownerId: string,
    options: {
      size?: number;
      page?: number;
      htype?: (typeof HabitType)[keyof typeof HabitType];
      pinned?: boolean;
    },
  ) {
    const conditions: SQL[] = [eq(habits.ownerId, ownerId)];

    if (options.htype) {
      conditions.push(eq(habits.htype, options.htype));
    }

    if (options.pinned !== undefined) {
      conditions.push(eq(habits.pinned, options.pinned));
    }

    const habitQuery = this.txHost.tx
      .select()
      .from(habits)
      .where(and(...conditions));

    if (options.page && options.size) {
      return habitQuery
        .limit(options.size)
        .offset((options.page - 1) * options.size);
    }

    return habitQuery;
  }

  getHabitsWithRandomStatement(
    ownerId: string,
    options: {
      size?: number;
      page?: number;
      htype?: (typeof HabitType)[keyof typeof HabitType];
      pinned?: boolean;
    },
  ) {
    const habitQuery = this.getHabits(ownerId, options).as('habit_query');

    const statementQuery = this.txHost.tx
      .select({
        statement: habitStatements.statement,
        source: habitStatements.source,
      })
      .from(habitStatements)
      .where(eq(habitQuery.id, habitStatements.habitId))
      .limit(1)
      .orderBy(sql`RANDOM()`)
      .as('statement');

    return this.txHost.tx
      .select({
        ...getColumns(habitQuery),
        statement: statementQuery.statement,
        source: statementQuery.source,
      })
      .from(habitQuery)
      .leftJoinLateral(statementQuery, sql`true`);
  }

  getLogOfHabits(fromDate: number, toDate: number, ...habitIds: string[]) {
    return this.txHost.tx
      .select()
      .from(habitLogs)
      .where(
        and(
          inArray(habitLogs.habitId, habitIds),
          between(
            habitLogs.forDate,
            sql`to_timestamp(${fromDate})`,
            sql`to_timestamp(${toDate})`,
          ),
        ),
      );
  }
}
