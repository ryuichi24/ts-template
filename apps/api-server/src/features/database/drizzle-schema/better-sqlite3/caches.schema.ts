import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const caches = sqliteTable("caches", {
  key: text("key").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export type CacheDBModel = InferSelectModel<typeof caches>;
export type InsertCacheDBModel = InferInsertModel<typeof caches>;
