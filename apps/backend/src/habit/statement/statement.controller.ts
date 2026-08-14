import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import StatementService from './statement.service';
import {
  CreateStatementSchema,
  GetStatementsByHabitSchema,
  UpdateStatementSchema,
} from './statement.validation';
import { Auth, User } from '../../utils/common/decorators';
import type { AppUser } from '../../utils/types';

@Controller('/statement')
@Auth()
export default class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Get('')
  async getStatementsByHabit(
    @User() user: AppUser,
    @Query() query: GetStatementsByHabitSchema,
  ) {
    return this.statementService.getStatementsByHabit(
      query.habitId,
      user.id,
      query.pageSize,
      query.page,
    );
  }

  @Get(':id')
  async getStatement(@Param(ParseUUIDPipe) id: string, @User() user: AppUser) {
    return await this.statementService.getStatement(id, user.id);
  }

  @Post('')
  async createStatement(
    @Body() data: CreateStatementSchema,
    @User() user: AppUser,
  ) {
    await this.statementService.createHabitStatement(user, data);
  }

  @Patch(':id')
  async updateStatement(
    @Param(ParseUUIDPipe) id: string,
    @Body() body: UpdateStatementSchema,
    @User() user: AppUser,
  ) {
    return await this.statementService.updateStatement(id, body, user.id);
  }

  @Delete(':id')
  async deleteStatement(
    @Param(ParseUUIDPipe) id: string,
    @User() user: AppUser,
  ) {
    await this.statementService.deleteStatement(id, user.id);
  }
}
