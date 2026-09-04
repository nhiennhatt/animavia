import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ClsModuleOptions } from 'nestjs-cls';
import DbModule from '../db/db.module';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';

export const clientModuleOptions: ClientsModuleAsyncOptions = {
  isGlobal: true,
  clients: [
    {
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'EMAIL_SERVICE',
      useFactory: (configService: ConfigService) => ({
        transport: Transport.REDIS,
        options: {
          host: new String(
            configService.get('REDIS_HOST', 'localhost') || 'localhost',
          ).toString(),
          port: parseInt(configService.get('REDIS_PORT', '6379')),
        },
      }),
    },
  ],
};

export const throllerModuleOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    throttlers: [
      {
        name: 'default',
        limit: parseInt(configService.get('RATE_LIMIT', '120')),
        ttl: parseInt(configService.get('RATE_LIMIT_TIME', `${6 * 1000}`)),
      },
    ],
  }),
};

export const clsModuleConfig: ClsModuleOptions = {
  global: true,
  plugins: [
    new ClsPluginTransactional({
      imports: [DbModule],
      adapter: new TransactionalAdapterDrizzleOrm({
        drizzleInstanceToken: 'DB',
      }),
    }),
  ],
};
