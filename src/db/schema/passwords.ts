import { relations } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { EncryptedValueType } from "../../utils/basicSchema";
import { users } from "./users";
import { vaults } from "./vaults";

export const passwords = pgTable("passwords", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  vaultId: integer("vault_id")
    .notNull()
    .references(() => vaults.id),
  site: varchar("site", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  password: json("password").$type<EncryptedValueType>().notNull(),
  faviconUrl: varchar("favicon_url", { length: 255 }),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.userId],
    references: [users.id],
  }),
  vault: one(vaults, {
    fields: [passwords.userId],
    references: [vaults.id],
  }),
}));
