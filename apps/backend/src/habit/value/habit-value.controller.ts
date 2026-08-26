import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import HabitValueService from './habit-value.service';
import { Auth, User } from '../../utils/common/decorators';
import type { AppUser } from '../../utils/types';
import { CreateHabitValueSchema } from './habit-value.validation';
import { UserStatusEnum } from '../../utils/constants';

@Controller('/habit-value')
@Auth({ status: [UserStatusEnum.ACTIVE] })
export default class HabitValueController {
  constructor(private readonly valueService: HabitValueService) {}

  @Post()
  async createHabitValue(
    @User() user: AppUser,
    @Body() payload: CreateHabitValueSchema,
  ) {
    return await this.valueService.createHabitValue(
      user.id,
      payload.habitId,
      payload.name,
      payload.value,
    );
  }

  @Get()
  async getHabitValues(
    @User() user: AppUser,
    @Query('habitId', new ParseUUIDPipe()) habitId: string,
  ) {
    return await this.valueService.getHabitValues(user.id, habitId);
  }
}
