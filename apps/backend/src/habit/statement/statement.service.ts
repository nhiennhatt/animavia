import { and, eq, SQL } from 'drizzle-orm';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  habits,
  habitStatements,
  type AppPgDatabaseType,
} from '../../db/db.schema';
import {
  CreateStatementSchema,
  UpdateStatementSchema,
} from './statement.validation';
import { AppUser } from '../../utils/types';

@Injectable()
export default class StatementService {
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async createHabitStatement(
    user: AppUser,
    { habitId, source, statement }: CreateStatementSchema,
  ) {
    const result = await this.db.transaction(async (tx) => {
      const result = await tx.query.habits.findFirst({
        columns: { id: true },
        where: { ownerId: user.id },
      });

      if (!result) throw new NotFoundException();

      const amount = await tx.$count(
        habitStatements,
        eq(habitStatements.habitId, habitId),
      );

      if (amount >= 10)
        throw new HttpException('OUT_OF_LIMT', HttpStatus.BAD_REQUEST);

      return await tx
        .insert(habitStatements)
        .values({
          habitId,
          statement,
          source,
        })
        .returning();
    });

    return result[0];
  }

  async getStatementsByHabit(
    habitId: string,
    userId: string,
    pageSize: number = 5,
    page: number = 1,
  ) {
    const habit = await this.db.query.habits.findFirst({
      columns: { id: true },
      where: { id: habitId, ownerId: userId },
    });

    if (!habit) throw new NotFoundException();

    return await this.db.query.habitStatements.findMany({
      where: { habitId },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }

  async getStatement(id: string, userId: string) {
    const selectStatment = this.db
      .select()
      .from(habitStatements)
      .where(eq(habitStatements.id, id))
      .limit(1)
      .as('target_statement');

    const selectStatementWithHabit = await this.db
      .select({
        id: selectStatment.id,
        statement: selectStatment.statement,
        source: selectStatment.source,
        habitId: selectStatment.habitId,
      })
      .from(selectStatment)
      .leftJoin(habits, eq(selectStatment.habitId, habits.id))
      .where(eq(habits.ownerId, userId))
      .limit(1);

    if (!selectStatementWithHabit || selectStatementWithHabit.length <= 0)
      throw new NotFoundException();

    return selectStatementWithHabit[0];
  }

  async updateStatement(
    id: string,
    body: UpdateStatementSchema,
    userId: string,
  ) {
    const selectStatment = this.db
      .select()
      .from(habitStatements)
      .where(eq(habitStatements.id, id))
      .limit(1)
      .as('target_statement');

    const selectStatementWithHabit = await this.db
      .select({
        id: selectStatment.id,
      })
      .from(selectStatment)
      .leftJoin(habits, eq(selectStatment.habitId, habits.id))
      .where(eq(habits.ownerId, userId))
      .limit(1);

    if (selectStatementWithHabit.length <= 0) throw new NotFoundException();

    return await this.db
      .update(habitStatements)
      .set(body)
      .where(and(eq(habitStatements.id, id)))
      .returning();
  }

  async deleteStatement(id: string, userId: string) {
    const selectStatment = this.db
      .select()
      .from(habitStatements)
      .where(eq(habitStatements.id, id))
      .limit(1)
      .as('target_statement');

    const selectStatementWithHabit = await this.db
      .select({
        id: selectStatment.id,
      })
      .from(selectStatment)
      .leftJoin(habits, eq(selectStatment.habitId, habits.id))
      .where(eq(habits.ownerId, userId))
      .limit(1);

    if (selectStatementWithHabit.length <= 0) throw new NotFoundException();

    await this.db.delete(habitStatements).where(eq(habitStatements.id, id));
  }
}
