import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import HabitValueService from './habit-value.service';
import HabitValueController from './habit-value.controller';

@Module({
  imports: [ConfigModule],
  providers: [HabitValueService],
  controllers: [HabitValueController],
})
export default class HabitValueModule {}
