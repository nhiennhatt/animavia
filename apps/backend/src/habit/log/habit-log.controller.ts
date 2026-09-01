import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Auth, User } from '../../utils/common/decorators';
import HabitLogService from './habit-log.service';
import { type AppUser } from '../../utils/types';
import {
  AddHabitLogSchema,
  GetHabitLogParamsSchema,
} from './habit-log.validation';

@Controller('/habit-log')
@Auth()
export default class HabitLogController {
  constructor(private readonly habitLogService: HabitLogService) {}

  @Post('')
  async createNewLog(
    @User() user: AppUser,
    @Body() payload: AddHabitLogSchema,
  ) {
    return this.habitLogService.log(user, payload.habitId, payload.date);
  }

  @Get('')
  async getLog(
    @User() user: AppUser,
    @Query()
    { habit_id, period, time }: GetHabitLogParamsSchema,
  ) {
    return await this.habitLogService.getLogs(user, habit_id, period, time);
  }

  @Get('/today')
  async isLoggedToday(
    @User() user: AppUser,
    @Query('habitId', new ParseUUIDPipe()) habitId: string,
  ) {
    return this.habitLogService.isLoggedByDate(user, habitId);
  }
}
