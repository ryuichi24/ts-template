import { sql } from "drizzle-orm";
import { c_timestamp } from "./custom-types/c-timestamp.js";

// YYYY-MM-DD HH:MM:SS
export const textTimestamp = {
  updatedAt: c_timestamp("updated_at")
    .notNull()
    .default(sql`(datetime('subsec'))`)
    .$onUpdate(() => sql`(datetime('subsec'))`),
  createdAt: c_timestamp("created_at")
    .notNull()
    .default(sql`(datetime('subsec'))`),
};
