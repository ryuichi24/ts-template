import crypto from "crypto";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";
import { utilSchema } from "./util-schema";

export const caches = utilSchema.table("caches", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: text("key").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type CacheDBModel = InferSelectModel<typeof caches>;
export type InsertCacheDBModel = InferInsertModel<typeof caches>;
