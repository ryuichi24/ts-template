import { Injectable } from "@nestjs/common";
// import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { databaseClientTypes, DatabaseConfig, DrizzleSchema } from "../type";

@Injectable()
export class DrizzlePostgresJsService<TSchema extends DrizzleSchema> {
  // private _drizzleClient: PostgresJsDatabase;

  constructor(config: DatabaseConfig<TSchema>) {
    // if (config.clientType !== databaseClientTypes.MYSQL2) {
    //   throw new Error("Invalid client type for Postgres-js");
    // }
    // // TODO: Implement Postgres client creation
    // const db = undefined as any;
    // const drizzleClient = drizzle(db, config.drizzleConfig);
    // this._drizzleClient = drizzleClient;
  }

  // get drizzleClient() {
  //   return this._drizzleClient;
  // }
}
