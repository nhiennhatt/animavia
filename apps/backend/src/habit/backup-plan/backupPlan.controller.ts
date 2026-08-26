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
import { Auth, User } from '../../utils/common/decorators';
import { UserStatusEnum } from '../../utils/constants';
import BackupPlanService from './backupPlan.service';
import type { AppUser } from '../../utils/types';
import {
  CreateBackupPlanSchema,
  UpdateBackupPlanSchema,
} from './backupPlan.validation';

@Controller('/backup-plan')
@Auth({ status: [UserStatusEnum.ACTIVE] })
export default class BackupPlanController {
  constructor(private readonly backupPlanService: BackupPlanService) {}

  @Post()
  async createBackupPlan(
    @User() user: AppUser,
    @Body() payload: CreateBackupPlanSchema,
  ) {
    return this.backupPlanService.createBackupPlan(
      payload.habitId,
      payload.ifCase,
      payload.then,
      user.id,
    );
  }

  @Get()
  async getBackupPlans(
    @User() user: AppUser,
    @Query('habitId', new ParseUUIDPipe()) habitId: string,
  ) {
    return this.backupPlanService.getBackupPlans(user.id, habitId);
  }

  @Delete('/:id')
  async deleteBackupPlan(
    @User() user: AppUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.backupPlanService.deleteBackupPlan(user.id, id);
  }

  @Put('/:id')
  async updateBackupPlan(
    @User() user: AppUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateBackupPlanSchema,
  ) {
    return await this.backupPlanService.updateBackupPlan(user.id, id, payload);
  }
}
