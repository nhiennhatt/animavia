import {
  Body,
  Controller,
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
  UpdateHabitValidation,
} from './habit.validation';

import { AuthGuard } from '../utils/common/guards';
import { Auth, User } from '../utils/common/decorators';
import { HabitType, UserStatusEnum } from '../utils/constants';
import type { AppUser } from '../utils/types';

@Controller('habit')
export default class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @UseGuards(AuthGuard)
  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Get('')
  async getOwnedHabits(
    @User() user: AppUser,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('cursor', new ParseUUIDPipe({ optional: true })) cursor?: string,
    @Query(
      'htype',
      new ParseEnumPipe(Object.values(HabitType), { optional: true }),
    )
    htype?: (typeof HabitType)[keyof typeof HabitType],
    @Query('cursor_datetime', new ParseDatePipe({ optional: true }))
    cursorDatetime?: Date,
  ) {
    return await this.habitService.getOwnedHabit(user.id, {
      size,
      cursor,
      cursorDatetime,
      htype,
    });
  }

  @UseGuards(AuthGuard)
  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Post('')
  async generateHabit(
    @Body() payload: GenerateHabitValidation,
    @User() user: AppUser,
  ) {
    return await this.habitService.generateHabit(user.id, payload);
  }

  @UseGuards(AuthGuard)
  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Patch(':id')
  async updateHabit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateHabitValidation,
    @User() user: AppUser,
  ) {
    return await this.habitService.updateHabit(user.id, id, payload);
  }
}
