import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import HabitValueRepository from './habit-value.repository';
import HabitService from '../habit/habit.service';

@Injectable()
export default class HabitValueService {
  constructor(
    private readonly habitService: HabitService,
    private readonly habitValueRepository: HabitValueRepository,
  ) {}

  async createHabitValue(
    userId: string,
    habitId: string,
    name: string,
    value: string,
  ) {
    const existHabit = await this.habitService.checkAlreadyExistingHabit(
      habitId,
      userId,
    );

    if (!existHabit) throw new NotFoundException();

    const opetationResult = await this.habitValueRepository
      .getTxHost()
      .withTransaction(async () => {
        const currentAmount =
          await this.habitValueRepository.countHabitValue(habitId);

        if (currentAmount >= 5) {
          throw new BadRequestException('OUT_OF_LIMIT');
        }

        const instance = await this.habitValueRepository.createNewHabitValue({
          habitId,
          name,
          value,
        });

        return instance;
      });

    if (opetationResult.length === 0) throw new InternalServerErrorException();

    return opetationResult[0];
  }

  async getHabitValues(userId: string, habitId: string) {
    const existHabit = await this.habitService.checkAlreadyExistingHabit(
      habitId,
      userId,
    );

    if (!existHabit) throw new NotFoundException();

    return await this.habitValueRepository.getHabitValues(habitId);
  }

  async updateHabitValue(
    id: string,
    userId: string,
    name: string,
    value: string,
  ) {
    const valueRecord =
      await this.habitValueRepository.getHabitValueByIdAndUserId(id, userId);

    if (valueRecord.length === 0) throw new NotFoundException();

    const result = await this.habitValueRepository.updateHabitValue(
      id,
      name,
      value,
    );

    if (result.length > 0) return result[0];
    return null;
  }

  async deleteHabitValue(id: string, userId: string) {
    const valueRecord =
      await this.habitValueRepository.getHabitValueByIdAndUserId(id, userId);

    if (valueRecord.length === 0) throw new NotFoundException();

    await this.habitValueRepository.deleteHabitValue(id);
  }
}
