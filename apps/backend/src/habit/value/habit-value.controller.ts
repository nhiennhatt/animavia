import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import HabitValueService from './habit-value.service';
import { Auth, User } from '../../utils/common/decorators';
import type { AppUser } from '../../utils/types';
import {
  CreateHabitValueSchema,
  UpdateHabitValueSchema,
} from './habit-value.validation';
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

  @Put('/:id')
  async updateHabitValue(
    @User() user: AppUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateHabitValueSchema,
  ) {
    return await this.valueService.updateHabitValue(
      id,
      user.id,
      payload.name,
      payload.value,
    );
  }

  @Delete('/:id')
  async deleteHabitValue(
    @User() user: AppUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.valueService.deleteHabitValue(id, user.id);
  }
}
