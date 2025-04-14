import { execSync } from "child_process";
import path from "path";
import url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// TODO: dynamically get the client type
const clientType = "better-sqlite3";

const schemaPattern = path.resolve(
  __dirname,
  "..",
  "dist",
  "features",
  "database",
  "drizzle-schema",
  clientType,
  "**",
  "*.js",
);
const migrationName = process.argv[2] || "";

if (!migrationName) {
  console.error("Please provide a migration name as: `pnpm db:gen:migrate:user-data <migration-name>`\n");
  process.exit(1);
}

const cmd = `drizzle-kit generate --dialect=sqlite --out db-migrations --schema ${schemaPattern} --name=${migrationName}`;

execSync(cmd, { stdio: "inherit" });
