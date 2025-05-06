import { getTableColumns, sql } from "drizzle-orm";
import { LogRepository } from "./log.repository.interface.js";
import { drizzleClient } from "../../../db/drizzle/drizzle-client.js";
import { SQLiteSyncDialect } from "drizzle-orm/sqlite-core";
import * as Schema from "../../../db/drizzle/schema/index.js";

const formatUUID = sql<string>`lower(
  substr(hex(id), 1, 8) || '-' ||
  substr(hex(id), 9, 4) || '-' ||
  substr(hex(id), 13, 4) || '-' ||
  substr(hex(id), 17, 4) || '-' ||
  substr(hex(id), 21)
)`;

const formatLevel = sql<string>`
CASE level
  WHEN 1 THEN 'DEBUG'
  WHEN 2 THEN 'INFO'
  WHEN 3 THEN 'WARN'
  WHEN 4 THEN 'ERROR'
  WHEN 5 THEN 'FATAL'
  ELSE 'UNKNOWN'
END AS level`;

export class LogRepositoryDrizzle implements LogRepository {
  async get(query: LogRepository.GetQuery): Promise<LogRepository.Log[]> {
    const logs = await drizzleClient.select().from(Schema.logs);
    return logs;
  }

  async create(cmd: LogRepository.CreateCommand): Promise<LogRepository.Log> {
    const created = await drizzleClient
      .insert(Schema.logs)
      .values({
        name: cmd.name,
        content: cmd.content,
        level: cmd.level,
        loggedAt: cmd.loggedAt,
      })
      .returning();

    return created as any;
  }

  async isReady(): Promise<boolean> {
    const result = drizzleClient.all(query.sql);
    return 0 < result.length;
  }
}

const sqliteDialect = new SQLiteSyncDialect();
const query = sqliteDialect.sqlToQuery(sql`SELECT * FROM 'sqlite_master' WHERE type = 'table' AND name = 'logs';`);
