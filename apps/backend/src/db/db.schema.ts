import {
  index,
  pgEnum,
  pgTable,
  smallint,
  timestamp,
  uuid,
  varchar,
  boolean,
  text,
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
  givenName: varchar('given_name', { length: 80 }).notNull(),
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
    weeklyGoal: smallint('weekly_goal').notNull().default(7),
    pinned: boolean().default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (tb) => [index('owner_createdAt_idx').on(tb.ownerId, desc(tb.createdAt))],
);

export const habitStatements = pgTable('habit_statements', {
  id: uuid().primaryKey().defaultRandom(),
  statement: varchar({ length: 260 }).notNull(),
  source: varchar({ length: 120 }),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
});

export const habitLogs = pgTable('habit_logs', {
  id: uuid().primaryKey().defaultRandom(),
  loggedAt: timestamp('logged_at').defaultNow(),
  thought: text(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
});

export const habitValues = pgTable('habit_values', {
  id: uuid().primaryKey().defaultRandom(),
  value: varchar({ length: 190 }).notNull(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
});

export const habitBackupPlans = pgTable('habit_backup_plans', {
  id: uuid().primaryKey().defaultRandom(),
  case: varchar({ length: 200 }).notNull(),
  then: varchar({ length: 200 }).notNull(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
});

export const dbRelations = defineRelations(
  { users, habits, habitLogs, habitStatements, habitValues, habitBackupPlans },
  (r) => ({
    habits: {
      owner: r.one.users({
        from: r.habits.ownerId,
        to: r.users.id,
      }),
    },
    habitLogs: {
      habit: r.one.habits({
        from: r.habitLogs.habitId,
        to: r.habits.id,
      }),
    },
    habitBackupPlans: {
      habit: r.one.habits({
        from: r.habitBackupPlans.habitId,
        to: r.habits.id,
      }),
    },
    habitStatements: {
      habit: r.one.habits({
        from: r.habitStatements.habitId,
        to: r.habits.id,
      }),
    },
    habitValues: {
      habit: r.one.habits({
        from: r.habitValues.habitId,
        to: r.habits.id,
      }),
    },
  }),
);

export type AppPgDatabaseType = NodePgDatabase<typeof dbRelations>;
