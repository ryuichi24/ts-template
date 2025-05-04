import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { DrizzleModule } from "../util/drizzle/drizzle.module";
import * as betterSqlite3DrizzleSchema from "./drizzle-schema/better-sqlite3/index.js";
import * as PgMainSchema from "./drizzle-schema/node-postgres/index.js";
import { ConfigService } from "../config/config.service";
import { BetterSqlite3DrizzleClientProvider } from "./providers/better-sqlite3-drizzle-client-provider";
import { NodePostgresDrizzleClientProvider } from "./providers/node-postgres-drizzle-client-provider";

// https://orm.drizzle.team/docs/data-querying#compose-a-where-statement-and-then-use-it-in-a-query

@Module({
  imports: [
    DrizzleModule.registerAsync({
      tag: BetterSqlite3DrizzleClientProvider,
      isGlobal: true,
      useFactory(config: ConfigService) {
        const dbConfig = config.getOrThrow("db.cache.sqlite", { infer: true });
        return {
          dbConfig: {
            clientType: "better-sqlite3",
            clientConfig: {
              filename: dbConfig.filename,
              options: {
                // verbose: console.log,
              },
            },
            drizzleConfig: {
              schema: {
                ...betterSqlite3DrizzleSchema,
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),

    DrizzleModule.registerAsync({
      tag: NodePostgresDrizzleClientProvider,
      isGlobal: true,
      useFactory(config: ConfigService) {
        const dbConfig = config.getOrThrow("db.main.postgres", { infer: true });
        return {
          dbConfig: {
            clientType: "node-postgres",
            clientConfig: {
              user: dbConfig.username,
              password: dbConfig.password,
              host: dbConfig.host,
              port: dbConfig.port,
              database: dbConfig.database,
            },
            drizzleConfig: {
              schema: { ...PgMainSchema },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
