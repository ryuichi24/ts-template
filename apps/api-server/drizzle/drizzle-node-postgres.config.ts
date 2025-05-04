import { defineConfig } from "drizzle-kit";

// https://orm.drizzle.team/docs/kit-overview
export default defineConfig({
  out: "./db-migrations/pg",
  dialect: "postgresql",
  schema: "./src/features/database/drizzle-schema/node-postgres/**/*.ts",
  migrations: {
    prefix: "timestamp",
  },
});
