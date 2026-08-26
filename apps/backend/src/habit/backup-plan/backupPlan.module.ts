import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import BackupPlanService from './backupPlan.service';
import BackupPlanController from './backupPlan.controller';

@Module({
  imports: [ConfigModule],
  providers: [BackupPlanService],
  controllers: [BackupPlanController],
})
export default class BackupPlanModule {}
