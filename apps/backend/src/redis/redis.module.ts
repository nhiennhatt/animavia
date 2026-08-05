import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [redisProvider],
})
export default class RedisModule implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  onModuleDestroy() {
    this.redisClient.disconnect();
  }
}
