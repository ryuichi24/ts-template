import { drizzle } from "drizzle-orm/better-sqlite3";
import { DBClient } from "../db-client.js";
import * as schema from "./schema/index.js";
import { logger } from "../../logger/logger.js";
import { Logger as IDrizzleLogger } from "drizzle-orm";
import { config } from "../../config/config.js";

const conn = DBClient.instance.getConn(config.db.main.path);

class DrizzleLogger implements IDrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    logger.debug(`[Drizzle] Query: ${query} | Params: ${JSON.stringify(params)}`);
  }
}

export const drizzleClient = drizzle(conn, {
  schema,
  casing: "snake_case",
  logger: process.env.NODE_ENV === "development" ? new DrizzleLogger() : false,
});
