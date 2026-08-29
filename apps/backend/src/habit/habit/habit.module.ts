import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import HabitService from './habit.service';
import HabitController from './habit.controller';
import HabitRepository from './habit.repository';

@Module({
  imports: [ConfigModule],
  providers: [HabitService, HabitRepository],
  controllers: [HabitController],
  exports: [HabitService],
})
export default class HabitModule {}
