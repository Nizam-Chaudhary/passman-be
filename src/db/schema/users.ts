import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { MasterKeyType } from "../../utils/basicSchema";
import { files } from "./files";
import { passwords } from "./passwords";
import { vaults } from "./vaults";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  masterPassword: varchar("master_password", { length: 255 }),
  masterKey: json("master_key").$type<MasterKeyType>(),
  recoveryKey: json("recovery_key").$type<MasterKeyType>(),
  isVerified: boolean("is_verified").default(false).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  fileId: integer().references(() => files.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  passwords: many(passwords),
  vaults: many(vaults),
  file: one(files, { references: [files.id], fields: [users.id] }),
}));
