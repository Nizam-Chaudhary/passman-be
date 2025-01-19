import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { EncryptedValueType } from "../../utils/basicSchema";
import { passwords } from "./passwords";
import { vaults } from "./vaults";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  masterKey: json("master_key").$type<EncryptedValueType>().notNull(),
  recoveryMasterKey: json("recovery_master_key")
    .$type<EncryptedValueType>()
    .notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  passwords: many(passwords),
  vaults: many(vaults),
}));
