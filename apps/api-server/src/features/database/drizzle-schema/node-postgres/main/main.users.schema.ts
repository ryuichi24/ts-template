import crypto from "crypto";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { text, boolean } from "drizzle-orm/pg-core";
import { mainSchema } from "./main-schema";
import { timestamp } from "drizzle-orm/pg-core";

export const users = mainSchema.table("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  avatarUrl: text("avatar_url"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type UserDBModel = InferSelectModel<typeof users>;
export type InsertUserDBModel = InferInsertModel<typeof users>;
