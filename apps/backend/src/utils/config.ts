import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

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
        limit: parseInt(configService.get('RATE_LIMIT', '120')),
        ttl: parseInt(configService.get('RATE_LIMIT_TIME', `${6 * 1000}`)),
      },
    ],
  }),
};
