import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import HabitService from './habit.service';
import HabitController from './habit.controller';

@Module({
  imports: [ConfigModule],
  providers: [HabitService],
  controllers: [HabitController],
})
export default class HabitModule {}
