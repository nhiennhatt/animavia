import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import StatementService from './statement.service';
import StatementController from './statement.controller';

@Module({
  imports: [ConfigModule],
  providers: [StatementService],
  controllers: [StatementController],
})
export default class StatementModule {}
