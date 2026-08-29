import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import {
  DbStransactionAdapter,
  habits,
  habitStatements,
} from '../../db/db.schema';
import { and, eq, getColumns, sql } from 'drizzle-orm';
import Repository from '../../utils/common/Repository';

@Injectable()
export default class StatementRepository extends Repository {
  countStatements(habitId: string) {
    return this.txHost.tx.$count(
      habitStatements,
      eq(habitStatements.habitId, habitId),
    );
  }

  createNewStatement(habitId: string, statement: string, source?: string) {
    return this.txHost.tx
      .insert(habitStatements)
      .values({
        habitId,
        statement,
        source,
      })
      .returning();
  }

  getStatements(habitId: string, pageSize: number, page: number) {
    return this.txHost.tx
      .select()
      .from(habitStatements)
      .where(eq(habitStatements.habitId, habitId))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  getStatementsWithRandomOrder(
    habitId: string,
    pageSize: number,
    page: number,
  ) {
    const query = this.getStatements(habitId, pageSize, page);
    return query.$dynamic().orderBy(sql`random()`);
  }

  getStatement(statementId: string, ownerId: string) {
    const selectStatment = this.txHost.tx
      .select()
      .from(habitStatements)
      .where(eq(habitStatements.id, statementId))
      .limit(1)
      .as('target_statement');

    return this.txHost.tx
      .select(getColumns(selectStatment))
      .from(selectStatment)
      .leftJoin(habits, eq(selectStatment.habitId, habits.id))
      .where(eq(habits.ownerId, ownerId))
      .limit(1);
  }

  async checkExistingStatement(statementId: string, ownerId: string) {
    const selectStatment = this.txHost.tx
      .select({ habitId: habitStatements.habitId })
      .from(habitStatements)
      .where(eq(habitStatements.id, statementId))
      .limit(1)
      .as('target_statement');

    const result = await this.txHost.tx
      .select(getColumns(selectStatment))
      .from(selectStatment)
      .leftJoin(habits, eq(selectStatment.habitId, habits.id))
      .where(eq(habits.ownerId, ownerId))
      .limit(1);

    return !!(result && result[0]);
  }

  updatestatement(
    id: string,
    body: Partial<typeof habitStatements.$inferInsert>,
  ) {
    return this.txHost.tx
      .update(habitStatements)
      .set(body)
      .where(and(eq(habitStatements.id, id)))
      .returning();
  }

  deleteStatement(id: string) {
    return this.txHost.tx
      .delete(habitStatements)
      .where(eq(habitStatements.id, id));
  }
}
