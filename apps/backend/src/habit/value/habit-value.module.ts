import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import HabitValueService from './habit-value.service';
import HabitValueController from './habit-value.controller';
import HabitValueRepository from './habit-value.repository';
import HabitModule from '../habit/habit.module';

@Module({
  imports: [ConfigModule, forwardRef(() => HabitModule)],
  providers: [HabitValueService, HabitValueRepository],
  controllers: [HabitValueController],
})
export default class HabitValueModule {}
