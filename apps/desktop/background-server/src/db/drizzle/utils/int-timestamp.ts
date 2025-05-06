import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

// https://orm.drizzle.team/docs/sql-schema-declaration#advanced
export const timestamp = {
  // https://orm.drizzle.team/docs/guides/timestamp-default-value#sqlite
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => sql`(unixepoch() * 1000)`),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
};
