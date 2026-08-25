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
  async addLog(@User() user: AppUser, @Body() payload: AddHabitLogSchema) {
    return await this.habitLogService.addLog(
      user,
      payload.habitId,
      payload.date,
      payload.thought,
    );
  }

  @Get('')
  async getLog(
    @User() user: AppUser,
    @Query()
    { habit_id, period, time, hasThoughtOnly }: GetHabitLogParamsSchema,
  ) {
    return await this.habitLogService.getLogs(
      user,
      habit_id,
      period,
      time,
      hasThoughtOnly,
    );
  }
}
