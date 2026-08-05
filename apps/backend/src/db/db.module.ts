import {
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';

import { dbProvider, poolProvider } from './db.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [poolProvider, dbProvider],
  exports: [dbProvider],
})
export default class DbModule implements OnModuleDestroy {
  private readonly logger = new Logger(DbModule.name);
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async onModuleDestroy() {
    this.logger.log('Ending database pool');
    await this.pool.end();
  }
}
