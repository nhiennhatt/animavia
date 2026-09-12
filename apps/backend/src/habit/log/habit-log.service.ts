import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { dayjs } from '../../utils';

import { AppUser } from '../../utils/types';
import HabitLogRepository from './habit-log.repository';
import HabitService from '../habit/habit.service';

@Injectable()
export default class HabitLogService {
  private readonly logger = new Logger(HabitLogService.name);
  constructor(
    private readonly habitLogRepo: HabitLogRepository,
    private readonly habitService: HabitService,
  ) {}

  async log(user: AppUser, habitId: string, date: number) {
    const now = dayjs().tz(user.timezone);
    const startOfDate = now.startOf('d').unix();
    const targetUnix = dayjs.unix(date).tz(user.timezone).startOf('d').unix();

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
      targetUnix < createdUnix ||
      targetUnix < startOfDate - 86400 ||
      (targetUnix < startOfDate && nowUnix >= startOfDate + 8 * 3600)
    ) {
      throw new BadRequestException('OUT_OF_DATE');
    }

    const result = await this.habitLogRepo.log({
      habitId,
      forDate: targetUnix,
    });

    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  }

  async getLogs(
    user: AppUser,
    habitId: string,
    timeUnit: 'M' | 'w' | 'd',
    time: number,
  ) {
    const habit = await this.habitService.getHabit(habitId, user.id);

    if (!habit) throw new NotFoundException();

    const userTimezone = user.timezone;
    const parsedTime = dayjs.unix(time).tz(userTimezone);

    return await this.habitLogRepo.getLogs(
      habitId,
      parsedTime.clone().startOf(timeUnit).unix(),
      parsedTime.clone().endOf(timeUnit).unix(),
    );
  }
}
