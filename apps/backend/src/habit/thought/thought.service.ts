import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import ThoughtRepository from './thought.repository';
import HabitService from '../habit/habit.service';
import { AppUser } from '../../utils/types';
import { dayjs } from '../../utils';

@Injectable()
export default class ThoughtService {
  constructor(
    private readonly thoughtRepository: ThoughtRepository,
    private readonly habitService: HabitService,
  ) {}

  async addHabitThought(
    user: AppUser,
    habitId: string,
    thought: string,
    forDate: number,
  ) {
    const now = dayjs().tz(user.timezone);
    const startOfDate = now.startOf('d').unix();
    const targetUnix = dayjs
      .unix(forDate)
      .tz(user.timezone)
      .startOf('d')
      .unix();

    if (targetUnix > startOfDate) {
      throw new BadRequestException('FUTURE_TARGET_DATE');
    }

    const habit = await this.habitService.getHabit(habitId, user.id);

    if (!habit) throw new NotFoundException();

    const nowUnix = now.unix();
    const createdUnix = dayjs(habit.createdAt)
      .tz(user.timezone)
      .startOf('d')
      .unix();

    if (
      targetUnix > createdUnix ||
      targetUnix < startOfDate - 86400 ||
      (targetUnix < startOfDate && nowUnix >= startOfDate + 8 * 3600)
    ) {
      throw new BadRequestException('OUT_OF_DATE');
    }

    const result = await this.thoughtRepository.addHabitThought(
      habitId,
      thought,
      targetUnix,
    );

    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }

  async getHabitThoughts(
    user: AppUser,
    habitId: string,
    time: number,
    unitTime: 'w' | 'M' | 'd',
  ) {
    const habit = await this.habitService.getHabit(habitId, user.id);

    if (!habit) throw new NotFoundException();

    const startTime = dayjs
      .unix(time)
      .tz(user.timezone)
      .startOf(unitTime)
      .unix();

    const endTime = dayjs.unix(time).tz(user.timezone).endOf(unitTime).unix();

    return await this.thoughtRepository.getHabitThoughts(
      habitId,
      startTime,
      endTime,
    );
  }

  async updateHabitThought(user: AppUser, thoughtId: string, thought: string) {
    const thoughtInstance = await this.thoughtRepository.getHabitThought(
      thoughtId,
      user.id,
    );

    if (!thoughtInstance || thoughtInstance.length === 0) {
      throw new NotFoundException();
    }

    const result = await this.thoughtRepository.updateHabitThought(
      thoughtId,
      thought,
    );

    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }

  async deleteHabitThought(user: AppUser, thoughtId: string) {
    const thoughtInstance = await this.thoughtRepository.getHabitThought(
      thoughtId,
      user.id,
    );

    if (!thoughtInstance || thoughtInstance.length === 0) {
      throw new NotFoundException();
    }

    await this.thoughtRepository.deleteHabitThought(thoughtId);
  }
}
