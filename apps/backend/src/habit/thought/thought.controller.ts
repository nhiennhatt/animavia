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
import ThoughtService from './thought.service';
import { Auth, User } from '../../utils/common/decorators';
import { type AppUser } from '../../utils/types';
import {
  AddHabitThoughtSchema,
  GetHabitThoughtSchema,
  UpdateHabitThoughtSchema,
} from './thought.validation';
import { dayjs } from '../../utils';

@Auth()
@Controller('habit-thought')
export default class ThoughtController {
  constructor(private readonly thoughtService: ThoughtService) {}

  @Get()
  async getHabitThought(
    @User() user: AppUser,
    @Query() query: GetHabitThoughtSchema,
  ) {
    const { habitId, time, unitTime } = query;

    return this.thoughtService.getHabitThoughts(user, habitId, time, unitTime);
  }

  @Post()
  async addHabitThought(
    @User() user: AppUser,
    @Body() body: AddHabitThoughtSchema,
  ) {
    const { habitId, thought, forDate } = body;

    return this.thoughtService.addHabitThought(user, habitId, thought, forDate);
  }

  @Put(':thoughtId')
  async updateHabitThought(
    @User() user: AppUser,
    @Param('thoughtId', new ParseUUIDPipe()) thoughtId: string,
    @Body() body: UpdateHabitThoughtSchema,
  ) {
    return this.thoughtService.updateHabitThought(
      user,
      thoughtId,
      body.thought,
    );
  }

  @Delete(':thoughtId')
  async deleteHabitThought(
    @User() user: AppUser,
    @Param('thoughtId', new ParseUUIDPipe()) thoughtId: string,
  ) {
    return this.thoughtService.deleteHabitThought(user, thoughtId);
  }
}
