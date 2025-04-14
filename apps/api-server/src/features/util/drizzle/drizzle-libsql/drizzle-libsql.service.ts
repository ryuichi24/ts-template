import { Injectable } from "@nestjs/common";
import { createClient, Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { DatabaseConfig, DrizzleSchema } from "../type";

@Injectable()
export class DrizzleLibsqlService<TSchema extends DrizzleSchema> {
  private _drizzleClient: LibSQLDatabase<TSchema> & {
    $client: Client;
  };

  constructor(config: DatabaseConfig<TSchema>) {
    if (config.clientType !== "libsql") {
      throw new Error("Invalid client type for LibSQL");
    }

    const { url, authToken } = config.clientConfig;
    const db = createClient({ url, authToken });
    const drizzleClient = drizzle(db, config.drizzleConfig);
    this._drizzleClient = drizzleClient;
  }

  get drizzleClient() {
    return this._drizzleClient;
  }
}
