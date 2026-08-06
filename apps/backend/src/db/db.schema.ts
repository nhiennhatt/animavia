import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserStatusEnum } from '../utils/constants';
import { Pool } from 'pg';

export const userStatusPgEnum = pgEnum(
  'user_status_enum',
  Object.values(UserStatusEnum) as [string, ...string[]],
);

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 50 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  status: userStatusPgEnum('status').default(UserStatusEnum.ACTIVE).notNull(),
});

export const dbRelations = defineRelations({ users }, () => ({}));

export type AppPgDatabaseType = NodePgDatabase<typeof dbRelations>;
