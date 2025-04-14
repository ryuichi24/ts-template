import { Injectable } from "@nestjs/common";
// import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import { databaseClientTypes, DatabaseConfig, DrizzleSchema } from "../type";

@Injectable()
export class DrizzleMysql2Service<TSchema extends DrizzleSchema> {
  // private _drizzleClient: MySql2Database;

  constructor(config: DatabaseConfig<TSchema>) {
    // if (config.clientType !== databaseClientTypes.MYSQL2) {
    //   throw new Error("Invalid client type for MySQL 2");
    // }
    // // TODO: Implement MySQL2 client creation
    // const db = undefined as any;
    // const drizzleClient = drizzle(db, config.drizzleConfig);
    // this._drizzleClient = drizzleClient;
  }

  // get drizzleClient() {
  //   return this._drizzleClient;
  // }
}
