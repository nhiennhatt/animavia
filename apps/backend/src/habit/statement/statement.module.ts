import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import StatementService from './statement.service';
import StatementController from './statement.controller';
import HabitModule from '../habit/habit.module';
import StatementRepository from './statement.repository';

@Module({
  imports: [ConfigModule, forwardRef(() => HabitModule)],
  providers: [StatementService, StatementRepository],
  controllers: [StatementController],
})
export default class StatementModule {}
