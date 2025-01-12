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
import { users } from "./user";

export const passwords = pgTable("passwords", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id),
    site: varchar("site", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    password: json("password").$type<EncryptedValueType>().notNull(),
    faviconUrl: varchar("favicon_url", { length: 255 }),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const passwordRelations = relations(passwords, ({ one }) => ({
    user: one(users, {
        fields: [passwords.userId],
        references: [users.id],
    }),
}));
