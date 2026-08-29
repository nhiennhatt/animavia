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
import { habits, habitStatements } from '../../db/db.schema';
import { HabitType } from '../../utils/constants';
import HabitRepository from './habit.repository';

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
    userId: string,
    options: {
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
    const data = await (options.includeQuote
      ? this.habitRepository.getHabits(userId, options)
      : this.habitRepository.getHabitsWithRandomStatement(userId, options));

    const total = await this.habitRepository.countHabitAmountOfUser(
      userId,
      options,
    );

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
