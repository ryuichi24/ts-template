import { Injectable } from "@nestjs/common";
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
  }

  get drizzleClient() {
    return this._drizzleClient;
  }
}
