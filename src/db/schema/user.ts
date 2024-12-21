import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { passwords } from "./password";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  saltValue: varchar("salt_value", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  passwords: many(passwords),
}));
