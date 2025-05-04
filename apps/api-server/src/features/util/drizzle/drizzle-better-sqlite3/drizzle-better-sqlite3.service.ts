import path from "path";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { Injectable } from "@nestjs/common";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { databaseClientTypes, DatabaseConfig, DrizzleSchema } from "../type";

@Injectable()
export class DrizzleBetterSqlite3Service<TSchema extends DrizzleSchema> {
  private _drizzleClient: BetterSQLite3Database<TSchema> & {
    $client: Database.Database;
  };

  constructor(config: DatabaseConfig<TSchema>) {
    if (config.clientType !== databaseClientTypes.BETTER_SQLITE3) {
      throw new Error("Invalid client type for Better SQLite3");
    }

    const { filename, options } = config.clientConfig;
    const db = new Database(filename || "sqlite.db", options);
    const drizzleClient = drizzle<TSchema>(db, config.drizzleConfig);
    this._drizzleClient = drizzleClient;

    try {
      migrate(drizzleClient, {
        migrationsFolder: path.join("db-migrations/sqlite"),
      });
      console.log("Database migrations completed");
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    } finally {
    }
  }

  get drizzleClient() {
    return this._drizzleClient;
  }
}
