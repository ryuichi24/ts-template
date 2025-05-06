import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db-migrations/sqlite",
  dialect: "sqlite",
  // https://github.com/drizzle-team/drizzle-orm/issues/849#issuecomment-1805634538
  schema: "./src/db/drizzle/schema/**/*.schema.ts",
  migrations: {
    prefix: "timestamp",
  },
});
