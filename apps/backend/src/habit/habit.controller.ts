import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import HabitService from './habit.service';
import { GenerateHabitValidation } from './habit.validation';

import { AuthGuard } from '../utils/common/guards';
import { Auth, User } from '../utils/common/decorators';
import { UserStatusEnum } from '../utils/constants';
import type { AppUser } from '../utils/types';

@Controller('habit')
export default class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @UseGuards(AuthGuard)
  @Auth({ status: [UserStatusEnum.ACTIVE] })
  @Post('')
  async generateHabit(
    @Body() payload: GenerateHabitValidation,
    @User() user: AppUser,
  ) {
    return await this.habitService.generateHabit(user.id, payload);
  }
}
