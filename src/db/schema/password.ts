import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const passwords = pgTable('passwords', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  username: varchar('username', { length: 255 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  iv: varchar('iv', { length: 255 }).notNull(),
  appName: varchar('app_name', { length: 255 }),
  baseUrl: varchar('base_url', { length: 255 }),
  specificUrl: varchar('specific_url', { length: 255 }),
  faviconUrl: varchar('favicon_url', { length: 255 }),
  notes: varchar('notes', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const passwordRelations = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.userId],
    references: [users.id],
  }),
}));
