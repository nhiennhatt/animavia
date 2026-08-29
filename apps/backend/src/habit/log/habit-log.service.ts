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

  async addLog(
    user: AppUser,
    habitId: string,
    date: number,
    isDone: boolean = true,
    thought?: string,
  ) {
    const habit = await this.habitService.getHabit(habitId, user.id);

    if (!habit) throw new NotFoundException();

    const currentDate = dayjs().tz(user.timezone);
    const logDate = dayjs.unix(date).tz(user.timezone);

    if (
      logDate.isBefore(currentDate.clone().subtract(1, 'd'), 'd') ||
      logDate.isAfter(currentDate, 'd')
    )
      throw new BadRequestException('OUT_OF_DATE');

    const isDoneFinal =
      logDate.isSame(currentDate, 'd') ||
      currentDate.isBefore(currentDate.clone().hour(8).startOf('h'), 'h')
        ? isDone
        : false;

    const result = await this.habitLogRepo
      .getTxHost()
      .withTransaction(async () => {
        const isLogged = await this.habitLogRepo.checkAlreadyExistLogInDate(
          habitId,
          logDate.clone().startOf('d').toDate(),
          logDate.clone().endOf('d').toDate(),
        );

        if (isLogged) throw new ConflictException();

        return this.habitLogRepo.insertNewLog({
          habitId,
          forDate: logDate.startOf('d').toDate(),
          thought,
        });
      });

    return result;
  }

  async getLogs(
    user: AppUser,
    habitId: string,
    timeUnit: 'm' | 'w',
    time: number,
    hasThoughtOnly: boolean = false,
  ) {
    const habit = await this.habitService.getHabit(habitId, user.id);

    if (!habit) throw new NotFoundException();

    const userTimezone = user.timezone;
    const parsedTime = dayjs.unix(time).tz(userTimezone);

    return await this.habitLogRepo.getLogs(
      habitId,
      parsedTime
        .clone()
        .startOf(timeUnit === 'w' ? timeUnit : 'M')
        .toDate(),
      parsedTime
        .clone()
        .endOf(timeUnit === 'w' ? timeUnit : 'M')
        .toDate(),
      hasThoughtOnly,
    );
  }

  async isLoggedToday(user: AppUser, habitId: string) {
    const habit = await this.habitService.getHabit(habitId, user.id);

    if (!habit) throw new NotFoundException();

    return this.habitLogRepo.isLoggedByDate(
      habitId,
      dayjs().startOf('d').toDate(),
      dayjs().endOf('d').toDate(),
    );
  }
}
