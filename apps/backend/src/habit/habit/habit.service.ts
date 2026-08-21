import { and, count, desc, eq, getColumns, sql } from 'drizzle-orm';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GenerateHabitValidation,
  UpdateHabitValidation,
} from './habit.validation';
import {
  habits,
  habitStatements,
  type AppPgDatabaseType,
} from '../../db/db.schema';
import { HabitType } from '../../utils/constants';

@Injectable()
export default class HabitService {
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async generateHabit(userId: string, habit: GenerateHabitValidation) {
    const generatedHabit = await this.db.transaction(async (tx) => {
      const habitAmount = await tx
        .select({ count: count(habits.id) })
        .from(habits)
        .where(eq(habits.ownerId, userId));

      if (habitAmount[0].count >= 10)
        throw new BadRequestException('OUT_OF_LIMIT');

      return await tx
        .insert(habits)
        .values({
          htype: habit.htype,
          domain: habit.domain,
          name: habit.name,
          objective: habit.objective,
          pinned: habit.pinned,
          weeklyGoal: habit.weeklyGoal,
          ownerId: userId,
        })
        .returning();
    });

    if (generatedHabit.length <= 0) throw new InternalServerErrorException();

    return generatedHabit[0];
  }

  async updateHabit(
    userId: string,
    id: string,
    payload: UpdateHabitValidation,
  ) {
    const result = await this.db
      .update(habits)
      .set(payload)
      .where(and(eq(habits.id, id), eq(habits.ownerId, userId)));

    if (!result.rowCount) throw new NotFoundException();

    return { message: 'Oki' };
  }

  async getOwnedHabits(
    userId: string,
    {
      size = 5,
      page = 1,
      htype,
      pinned,
      includeQuote = true,
    }: {
      size?: number;
      page?: number;
      htype?: (typeof HabitType)[keyof typeof HabitType];
      pinned?: boolean;
      includeQuote?: boolean;
    },
  ): Promise<{
    data: (typeof habits.$inferSelect & {
      [K in keyof typeof habitStatements.$inferSelect]?:
        (typeof habitStatements.$inferSelect)[K] | null;
    })[];
    total: number;
  }> {
    const condition = [eq(habits.ownerId, userId)];

    if (pinned !== undefined) condition.push(eq(habits.pinned, pinned));

    if (htype) condition.push(eq(habits.htype, htype));

    const depaginateHabitQuery = () =>
      this.db
        .select()
        .from(habits)
        .where(and(...condition))
        .orderBy(desc(habits.createdAt));

    const habitQuery = depaginateHabitQuery()
      .offset((page - 1) * size)
      .limit(Math.min(size, 10));

    let result:
      | (typeof habits.$inferSelect & {
          [K in keyof typeof habitStatements.$inferSelect]?:
            (typeof habitStatements.$inferSelect)[K] | null;
        })[]
      | null = null;

    if (includeQuote) {
      const habitQueryAlias = habitQuery.as('habits');
      const statementQueryAlias = this.db
        .select({
          statement: habitStatements.statement,
          source: habitStatements.source,
        })
        .from(habitStatements)
        .where(eq(habitQueryAlias.id, habitStatements.habitId))
        .limit(1)
        .orderBy(sql`RANDOM()`)
        .as('statement');

      result = await this.db
        .select({
          ...getColumns(habitQueryAlias),
          statement: statementQueryAlias.statement,
          source: statementQueryAlias.source,
        })
        .from(habitQueryAlias)
        .leftJoinLateral(statementQueryAlias, sql`true`);
    }

    const depaginateHabitQueryAlias = depaginateHabitQuery().as('habits');
    const totalResult = await this.db
      .select({
        amount: count(depaginateHabitQueryAlias.id),
      })
      .from(depaginateHabitQueryAlias);
    const total = totalResult[0].amount;

    if (result === null) result = await habitQuery;

    return { data: result, total: total };
  }

  async getHabit(id: string, userId: string) {
    const result = await this.db
      .select()
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.ownerId, userId)));

    if (!result || result.length === 0) throw new NotFoundException();

    return result[0];
  }

  async deleteHabit(id: string, userId: string) {
    const result = await this.db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.ownerId, userId)));

    if (result.rowCount === 0) throw new NotFoundException();
  }
}
