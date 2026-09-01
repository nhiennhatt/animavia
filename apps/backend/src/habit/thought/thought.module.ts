import { forwardRef, Module } from '@nestjs/common';
import ThoughtService from './thought.service';
import ThoughtRepository from './thought.repository';
import HabitModule from '../habit/habit.module';
import ThoughtController from './thought.controller';

@Module({
  imports: [forwardRef(() => HabitModule)],
  providers: [ThoughtRepository, ThoughtService],
  controllers: [ThoughtController],
})
export default class ThoughtModule {}
