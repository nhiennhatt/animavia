import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import { dbRelations } from './db.schema';

export const poolProvider: Provider = {
  provide: 'PG_POOL',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Pool({
      connectionString: configService.get('DB_URL', ''),
    });
  },
};

export const dbProvider: Provider = {
  provide: 'DB',
  inject: ['PG_POOL'],
  useFactory: (pool: Pool) => {
    return drizzle({ client: pool, relations: dbRelations });
  },
};
