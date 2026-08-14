import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GenerateHabitValidation,
  UpdateHabitValidation,
} from './habit.validation';
import { habits, type AppPgDatabaseType } from '../../db/db.schema';
import { and, desc, eq, gt, lt, or, SQL } from 'drizzle-orm';
import { HabitType } from '../../utils/constants';

@Injectable()
export default class HabitService {
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async generateHabit(userId: string, habit: GenerateHabitValidation) {
    const generatedHabit = await this.db
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
      size = 10,
      cursor,
      cursorDatetime,
      htype,
      pinned,
    }: {
      size?: number;
      cursor?: string;
      cursorDatetime?: Date;
      htype?: (typeof HabitType)[keyof typeof HabitType];
      pinned?: boolean;
    },
  ) {
    const condition = [eq(habits.ownerId, userId)];

    if (!cursor && cursorDatetime) {
      condition.push(lt(habits.createdAt, cursorDatetime));
    }

    if (cursor && cursorDatetime) {
      condition.push(
        or(
          lt(habits.createdAt, cursorDatetime),
          and(eq(habits.createdAt, cursorDatetime), gt(habits.id, cursor)),
        ) as SQL,
      );
    }

    if (pinned !== undefined) condition.push(eq(habits.pinned, pinned));

    if (htype) condition.push(eq(habits.htype, htype));

    return await this.db
      .select()
      .from(habits)
      .where(and(...condition))
      .orderBy(desc(habits.createdAt))
      .limit(Math.min(size, 10));
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
