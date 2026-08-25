import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { dayjs } from '../../utils';

import { habitLogs, habits, type AppPgDatabaseType } from '../../db/db.schema';
import { AppUser } from '../../utils/types';
import { and, between, eq, getColumns, isNotNull, ne, sql } from 'drizzle-orm';

@Injectable()
export default class HabitLogService {
  private readonly logger = new Logger(HabitLogService.name);
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async addLog(user: AppUser, habitId: string, date: number, thought?: string) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, user.id)))
      .limit(1);

    if (!habit || habit.length === 0) throw new NotFoundException();

    const userTimeZone = user.timezone;
    const currentInUnix = dayjs().unix();
    const startOfCurrentDateInUnix = dayjs()
      .tz(userTimeZone)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .unix();
    const endOfCurrentDateInUnix = startOfCurrentDateInUnix + 86400;
    const startOfYesterdayInUnix = startOfCurrentDateInUnix - 86400;
    const extendTime = startOfCurrentDateInUnix + 25200; // 7am

    if (
      date >= endOfCurrentDateInUnix ||
      date < startOfYesterdayInUnix ||
      (date < startOfCurrentDateInUnix && currentInUnix >= extendTime)
    ) {
      throw new BadRequestException('OUT_OF_DATE');
    }

    const isToday = currentInUnix >= startOfCurrentDateInUnix;

    const comparedStartUnix = isToday
      ? startOfCurrentDateInUnix
      : endOfCurrentDateInUnix;

    const comparedEndUnix = isToday
      ? endOfCurrentDateInUnix
      : startOfCurrentDateInUnix;

    return await this.db.transaction(async (tx) => {
      const exist = await tx
        .select({ id: habitLogs.id })
        .from(habitLogs)
        .where(
          and(
            eq(habitLogs.habitId, habitId),
            between(
              habitLogs.forDate,
              sql`to_timestamp(${comparedStartUnix})`,
              sql`to_timestamp(${comparedEndUnix - 1})`,
            ),
          ),
        );

      if (exist && exist.length >= 1) throw new BadRequestException();

      return await tx
        .insert(habitLogs)
        .values({
          habitId,
          forDate: sql`to_timestamp(${date})`,
          thought,
        })
        .returning();
    });
  }

  async getLogs(
    user: AppUser,
    habitId: string,
    timeUnit: 'm' | 'w',
    time: number,
    hasThoughtOnly: boolean = false,
  ) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, user.id)));

    if (!habit || habit.length === 0) throw new NotFoundException();

    const userTimezone = user.timezone;
    const parsedTime = dayjs.unix(time).tz(userTimezone);
    const startOfTime = parsedTime
      .clone()
      .hour(0)
      .minute(0)
      .second(0)
      .subtract(
        timeUnit === 'w' ? parsedTime.day() : parsedTime.date() - 1,
        'd',
      );
    const endOfTime =
      timeUnit === 'w'
        ? startOfTime.clone().add(7, 'd')
        : startOfTime.clone().add(1, 'M');

    return await this.db
      .select({
        ...getColumns(habitLogs),
        forDate: sql<number>`EXTRACT(EPOCH FROM ${habitLogs.forDate})::INTEGER`,
      })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          ...(hasThoughtOnly
            ? [
                isNotNull(habitLogs.thought),
                ne(sql`TRIM(${habitLogs.thought})`, ''),
              ]
            : []),
          between(
            habitLogs.forDate,
            sql`to_timestamp(${startOfTime.unix()})`,
            sql`to_timestamp(${endOfTime.unix()})`,
          ),
        ),
      );
  }

  async isLoggedToday(user: AppUser, habitId: string) {
    const habit = await this.db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, habitId), eq(habits.ownerId, user.id)));

    if (!habit || habit.length === 0) throw new NotFoundException();

    const result = await this.db
      .select({ id: habitLogs.id })
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          between(
            habitLogs.forDate,
            sql`TO_TIMESTAMP(${dayjs().tz(user.timezone).startOf('d').unix()})`,
            sql`TO_TIMESTAMP(${dayjs().tz(user.timezone).endOf('d').unix()})`,
          ),
        ),
      );

    if (!result || result.length === 0) return false;

    return true;
  }
}
