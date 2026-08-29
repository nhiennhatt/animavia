import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import BackupPlanService from './backupPlan.service';
import BackupPlanController from './backupPlan.controller';
import BackupPlanRepository from './backupPlan.repository';
import HabitModule from '../habit/habit.module';

@Module({
  imports: [ConfigModule, forwardRef(() => HabitModule)],
  providers: [BackupPlanService, BackupPlanRepository],
  controllers: [BackupPlanController],
})
export default class BackupPlanModule {}
