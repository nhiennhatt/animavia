import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProvider: Provider = {
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) =>
    new Redis({
      host: configService.get('REDIS_HOST', ''),
      port: parseInt(configService.get('REDIS_PORT', '6379')),
    }),
};
