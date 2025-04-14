import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { DrizzleModule } from "../util/drizzle/drizzle.module";
import * as betterSqlite3DrizzleSchema from "./drizzle-schema/better-sqlite3/index.js";
import * as libsqlDrizzleSchema from "./drizzle-schema/libsql/index.js";

@Module({
  imports: [
    DrizzleModule.register({
      tag: "DB_CLIENT:DRIZZLE",
      isGlobal: true,
      dbConfig: {
        drizzleConfig: {
          schema: {
            caches: betterSqlite3DrizzleSchema.caches,
          },
        },
        clientType: "better-sqlite3",
        clientConfig: {
          filename: "cache.db",
          options: {
            // verbose: console.log,
          },
        },
      },
    }),

    // DrizzleModule.register({
    //   tag: "DB_CLIENT:DRIZZLE",
    //   isGlobal: true,
    //   dbConfig: {
    //     drizzleConfig: {
    //       schema: {
    //         caches: libsqlDrizzleSchema.caches,
    //       },
    //     },
    //     clientType: "libsql",
    //     clientConfig: {
    //       url: "file:libsql.db",
    //       authToken: "hdrvjeroiuvrslkvseoi",
    //     },
    //   },
    // }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
