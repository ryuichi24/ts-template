import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { sqliteTable, integer, text, sqliteView } from "drizzle-orm/sqlite-core";
import { id } from "../utils/id.js";
import { c_timestamp } from "../utils/custom-types/c-timestamp.js";

export const logs = sqliteTable("logs", {
  id: id(),
  name: text("name").notNull(),
  level: integer("level", { mode: "number" }).notNull(),
  content: text("message").notNull(),
  loggedAt: c_timestamp("logged_at")
    .notNull()
    .default(sql`(datetime('subsec'))`),
});

// https://orm.drizzle.team/docs/views#declaring-views-with-raw-sql
export const logsView = sqliteView("logs_view", {
  id: text("id").notNull(),
  name: text("name").notNull(),
  level: text("level").notNull(),
  message: text("message").notNull(),
  loggedAt: text("logged_at").notNull(),
}).as(sql`
  SELECT
  id,
  name,
  CASE level
    WHEN 1 THEN 'INFO'
    WHEN 2 THEN 'WARNING'
    WHEN 3 THEN 'ERROR'
    WHEN 4 THEN 'DEBUG'
    ELSE 'UNKNOWN'
  END AS level,
  message,
  logged_at
FROM logs;
`);

export type LogDBModel = InferSelectModel<typeof logs>;
export type InsertLogDBModel = InferInsertModel<typeof logs>;
