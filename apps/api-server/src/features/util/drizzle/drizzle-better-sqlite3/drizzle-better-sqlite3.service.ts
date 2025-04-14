import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { databaseClientTypes, DatabaseConfig, DrizzleSchema } from "../type";
import path from "path";

@Injectable()
export class DrizzleBetterSqlite3Service<TSchema extends DrizzleSchema> implements OnModuleInit {
  private _drizzleClient: BetterSQLite3Database<TSchema> & {
    $client: Database.Database;
  };

  constructor(config: DatabaseConfig<TSchema>) {
    if (config.clientType !== databaseClientTypes.BETTER_SQLITE3) {
      throw new Error("Invalid client type for Better SQLite3");
    }

    const { filename, options } = config.clientConfig;
    const db = new Database(filename || "sqlite.db", options);
    const drizzleClient = drizzle(db, config.drizzleConfig);
    this._drizzleClient = drizzleClient;

    try {
      db.exec("PRAGMA foreign_keys = OFF;");
      migrate(drizzleClient, {
        migrationsFolder: path.join("db-migrations"),
      });
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    } finally {
      console.log("Database migrations completed");
      
      db.exec("PRAGMA foreign_keys = ON;");
    }
  }

  get drizzleClient() {
    return this._drizzleClient;
  }

  onModuleInit() {
    console.log("DrizzleBetterSqlite3Service initialized");
  }
}
