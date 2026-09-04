import { Injectable } from '@nestjs/common';
import Repository from '../../utils/common/Repository';
import { habits, habitThoughts } from '../../db/db.schema';
import { and, between, eq, getColumns, sql } from 'drizzle-orm';

@Injectable()
export default class ThoughtRepository extends Repository {
  addHabitThought(habitId: string, thought: string, forDate: number) {
    return this.txHost.tx
      .insert(habitThoughts)
      .values({
        habitId,
        thought,
        forDate: sql`to_timestamp(${forDate})`,
      })
      .onConflictDoUpdate({
        target: [habitThoughts.habitId, habitThoughts.forDate],
        set: {
          thought,
        },
      })
      .returning();
  }

  updateHabitThought(thoughtId: string, thought: string) {
    return this.txHost.tx
      .update(habitThoughts)
      .set({
        thought,
      })
      .where(eq(habitThoughts.id, thoughtId))
      .returning();
  }

  getHabitThought(thoughtId: string, userId: string) {
    return this.txHost.tx
      .select({
        ...getColumns(habitThoughts),
      })
      .from(habitThoughts)
      .leftJoin(
        habits,
        and(eq(habitThoughts.habitId, habits.id), eq(habits.ownerId, userId)),
      )
      .where(eq(habitThoughts.id, thoughtId));
  }

  deleteHabitThought(thoughtId: string) {
    return this.txHost.tx
      .delete(habitThoughts)
      .where(eq(habitThoughts.id, thoughtId));
  }

  getHabitThoughts(habitId: string, startTime: number, endTime: number) {
    return this.txHost.tx
      .select()
      .from(habitThoughts)
      .where(
        and(
          eq(habitThoughts.habitId, habitId),
          between(
            habitThoughts.forDate,
            sql`to_timestamp(${startTime})`,
            sql`to_timestamp(${endTime})`,
          ),
        ),
      );
  }
}
