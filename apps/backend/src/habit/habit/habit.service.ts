import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  GenerateHabitValidation,
  UpdateHabitValidation,
} from './habit.validation';
import { habitLogs, habits, habitStatements } from '../../db/db.schema';
import { HabitType } from '../../utils/constants';
import HabitRepository from './habit.repository';
import { AppUser, Nullable } from '../../utils/types';
import { dayjs } from '../../utils';

type HabitWithQuote = typeof habits.$inferSelect &
  Partial<
    Nullable<Pick<typeof habitStatements.$inferSelect, 'source' | 'statement'>>
  >;

@Injectable()
export default class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async checkAlreadyExistingHabit(habitId: string, ownerId: string) {
    return await this.habitRepository.checkAlreadyExistingHabit(
      habitId,
      ownerId,
    );
  }

  async generateHabit(userId: string, habit: GenerateHabitValidation) {
    const generatedHabit = await this.habitRepository
      .getTxHost()
      .withTransaction(async () => {
        const habitAmount =
          await this.habitRepository.countHabitAmountOfUser(userId);

        if (habitAmount >= 10) throw new BadRequestException('OUT_OF_LIMIT');

        return this.habitRepository.createNewHabit({
          ...habit,
          ownerId: userId,
        });
      });

    if (generatedHabit.length <= 0) throw new InternalServerErrorException();

    return generatedHabit[0];
  }

  async updateHabit(
    userId: string,
    id: string,
    payload: UpdateHabitValidation,
  ) {
    const result = await this.habitRepository.updateHabitByIdAndOwnerId(
      id,
      userId,
      payload,
    );

    if (result.length === 0) throw new NotFoundException();

    return { message: 'Oki' };
  }

  async getOwnedHabits(
    user: AppUser,
    {
      includeLog,
      ...options
    }: {
      size?: number;
      page?: number;
      htype?: (typeof HabitType)[keyof typeof HabitType];
      pinned?: boolean;
      includeQuote?: boolean;
      includeLog?: boolean;
    },
  ): Promise<{
    data: (HabitWithQuote & { logs?: number[] })[];
    total: number;
  }> {
    const data: HabitWithQuote[] = await (options.includeQuote
      ? this.habitRepository.getHabitsWithRandomStatement(user.id, options)
      : this.habitRepository.getHabits(user.id, options));

    const total = await this.habitRepository.countHabitAmountOfUser(
      user.id,
      options,
    );

    if (includeLog) {
      const startOfWeek = dayjs().tz(user.timezone).startOf('w').unix();
      const ids = data.map((habit) => habit.id);
      const logs = await this.habitRepository.getLogOfHabits(
        startOfWeek,
        startOfWeek + 604800 - 1,
        ...ids,
      );

      return {
        data: data.map((h) => ({
          ...h,
          logs: logs
            .filter((l) => l.habitId === h.id)
            .map((l) => dayjs(l.forDate).unix()),
        })),
        total,
      };
    }

    return {
      data,
      total,
    };
  }

  async getHabit(id: string, userId: string) {
    const result = await this.habitRepository.getHabitByIdOwnerId(id, userId);

    if (!result || result.length === 0) throw new NotFoundException();

    return result[0];
  }

  async deleteHabit(id: string, userId: string) {
    const result = await this.habitRepository.deleteHabitByIdAndOwnerId(
      id,
      userId,
    );

    if (result.rowCount === 0) throw new NotFoundException();
  }
}
