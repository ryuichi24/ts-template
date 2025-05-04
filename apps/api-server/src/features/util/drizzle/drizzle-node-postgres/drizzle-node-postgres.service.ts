import path from "path";
import { Injectable } from "@nestjs/common";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DrizzleSchema, DatabaseConfig, databaseClientTypes } from "../type";

@Injectable()
export class DrizzleNodePostgresService<TSchema extends DrizzleSchema> {
  private _drizzleClient: NodePgDatabase<TSchema> & {
    $client: Pool;
  };

  constructor(config: DatabaseConfig<TSchema>) {
    if (config.clientType !== databaseClientTypes.NODE_POSTGRES) {
      throw new Error("Invalid client type for Node Postgres");
    }
    const { clientConfig, drizzleConfig } = config;

    const pool = new Pool(clientConfig);

    const drizzleClient = drizzle<TSchema>({
      client: pool,
      ...drizzleConfig,
    });

    this._drizzleClient = drizzleClient;

    // Perform migrations
    try {
      migrate(drizzleClient, {
        migrationsFolder: path.join("db-migrations/pg"),
      });
      console.log("Database migrations completed");
    } catch (error) {
      if (error instanceof Error) console.log("Error during migrations:", error);
    } finally {
    }
  }

  get drizzleClient() {
    return this._drizzleClient;
  }
}
