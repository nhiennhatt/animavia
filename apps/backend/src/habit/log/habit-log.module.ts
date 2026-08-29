import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import HabitLogService from './habit-log.service';
import HabitLogController from './habit-log.controller';
import HabitLogRepository from './habit-log.repository';
import HabitModule from '../habit/habit.module';

@Module({
  imports: [ConfigModule, forwardRef(() => HabitModule)],
  providers: [HabitLogService, HabitLogRepository],
  controllers: [HabitLogController],
})
export default class HabitLogModule {}
