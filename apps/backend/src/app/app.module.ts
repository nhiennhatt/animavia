import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from '../auth/auth.module';
import DbModule from '../db/db.module';
import RedisModule from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    RedisModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          imports: [ConfigModule],
          inject: [ConfigService],
          name: 'EMAIL_SERVICE',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.REDIS,
            options: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              host: configService.get('REDIS_HOST', ''),
              port: parseInt(configService.get('REDIS_PORT', '6379')),
            },
          }),
        },
      ],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
