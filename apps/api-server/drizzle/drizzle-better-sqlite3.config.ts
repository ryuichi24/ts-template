import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db-migrations/sqlite",
  dialect: "sqlite",
  schema: "./src/features/database/drizzle-schema/better-sqlite3/**/*.ts",
  migrations: {
    prefix: "timestamp",
  },
});
