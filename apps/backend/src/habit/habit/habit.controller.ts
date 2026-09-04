import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseDatePipe,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import HabitService from './habit.service';
import {
  GenerateHabitValidation,
  GetOwnedHabitSchema,
  UpdateHabitValidation,
} from './habit.validation';

import { Auth, User } from '../../utils/common/decorators';
import { HabitType, UserStatusEnum } from '../../utils/constants';
import type { AppUser } from '../../utils/types';

@Controller('habit')
export default class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Get('')
  async getOwnedHabits(
    @User() user: AppUser,
    @Query() query: GetOwnedHabitSchema,
  ) {
    return await this.habitService.getOwnedHabits(user, {
      size: query.size,
      htype: query.htype,
      page: query.page,
      pinned: query.pinned === undefined ? query.pinned : !!query.pinned,
      includeLog: query.includeLog,
      includeQuote: query.includeQuote,
    });
  }

  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Post('')
  async generateHabit(
    @Body() payload: GenerateHabitValidation,
    @User() user: AppUser,
  ) {
    return await this.habitService.generateHabit(user.id, payload);
  }

  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Patch(':id')
  async updateHabit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateHabitValidation,
    @User() user: AppUser,
  ) {
    return await this.habitService.updateHabit(user.id, id, payload);
  }

  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Get(':id')
  async getHabit(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: AppUser,
  ) {
    return await this.habitService.getHabit(id, user.id);
  }

  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Delete(':id')
  async deleteHabit(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: AppUser,
  ) {
    await this.habitService.deleteHabit(id, user.id);
  }
}
