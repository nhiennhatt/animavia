import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from '../auth/auth.module';
import DbModule from '../db/db.module';
import RedisModule from '../redis/redis.module';
import UserModule from '../user/user.module';
import HabitModule from '../habit/habit/habit.module';
import StatementModule from '../habit/statement/statement.module';
import HabitLogModule from '../habit/log/habit-log.module';
import BackupPlanModule from '../habit/backup-plan/backupPlan.module';
import HabitValueModule from '../habit/value/habit-value.module';
import {
  clientModuleOptions,
  clsModuleConfig,
  throllerModuleOptions,
} from '../utils/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    ClsModule.forRoot(clsModuleConfig),
    RedisModule,
    ClientsModule.registerAsync(clientModuleOptions),
    ThrottlerModule.forRootAsync(throllerModuleOptions),
    AuthModule,
    UserModule,
    HabitModule,
    StatementModule,
    HabitLogModule,
    BackupPlanModule,
    HabitValueModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
