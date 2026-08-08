import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { defineRelations, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  HabitType,
  LifeDomains,
  UserRoleEnum,
  UserStatusEnum,
} from '../utils/constants';

export const userStatusPgEnum = pgEnum(
  'user_status_enum',
  Object.values(UserStatusEnum) as [string, ...string[]],
);

export const userRolePgEnum = pgEnum(
  'user_role_enum',
  Object.values(UserRoleEnum) as [string, ...string[]],
);

export const lifeDomainPgEnum = pgEnum(
  'life_domain_enum',
  Object.values(LifeDomains) as [string, ...string[]],
);

export const habitTypePgEnum = pgEnum(
  'habit_type_enum',
  Object.values(HabitType) as [string, ...string[]],
);

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 50 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  status: userStatusPgEnum('status').default(UserStatusEnum.ACTIVE).notNull(),
  role: userRolePgEnum('role').default(UserRoleEnum.PRACTITIONER).notNull(),
});

export const habits = pgTable(
  'habits',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 120 }).notNull(),
    objective: varchar({ length: 360 }),
    htype: habitTypePgEnum().notNull(),
    domain: lifeDomainPgEnum().array().default([]),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp().defaultNow(),
  },
  (tb) => [index('owner_createdAt_idx').on(tb.ownerId, desc(tb.createdAt))],
);

export const dbRelations = defineRelations({ users, habits }, (r) => ({
  habits: {
    owner: r.one.users({
      from: r.habits.ownerId,
      to: r.users.id,
    }),
  },
}));

export type AppPgDatabaseType = NodePgDatabase<typeof dbRelations>;
