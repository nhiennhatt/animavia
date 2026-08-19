import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import HabitLogService from './habit-log.service';
import HabitLogController from './habit-log.controller';

@Module({
  imports: [ConfigModule],
  providers: [HabitLogService],
  controllers: [HabitLogController],
})
export default class HabitLogModule {}
