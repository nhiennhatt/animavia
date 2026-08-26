import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import {
  habits,
  habitValues,
  type AppPgDatabaseType,
} from '../../db/db.schema';

@Injectable()
export default class HabitValueService {
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async createHabitValue(
    userId: string,
    habitId: string,
    name: string,
    value: string,
  ) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, userId)));

    if (!habit || habit.length === 0) throw new NotFoundException();

    const opetationResult = await this.db.transaction(async (tx) => {
      const currentAmount = await tx
        .select({ amount: count(habitValues.id) })
        .from(habitValues)
        .where(eq(habitValues.habitId, habitId));

      if (currentAmount && currentAmount[0] && currentAmount[0].amount >= 5) {
        throw new BadRequestException('OUT_OF_LIMIT');
      }

      const instance = await tx
        .insert(habitValues)
        .values({ habitId, name, value })
        .returning();

      return instance;
    });

    if (opetationResult.length === 0) throw new InternalServerErrorException();

    return opetationResult[0];
  }

  async getHabitValues(userId: string, habitId: string) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, userId)));

    if (!habit || habit.length === 0) throw new NotFoundException();

    return await this.db
      .select()
      .from(habitValues)
      .where(eq(habitValues.habitId, habitId));
  }
}
