import Database from "better-sqlite3";
import { DrizzleConfig } from "drizzle-orm";
import { MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import { Config as LibsqlConfig } from "@libsql/client";

export const databaseClientTypes = {
  BETTER_SQLITE3: "better-sqlite3",
  LIBSQL: "libsql",
  POSTGRES_JS: "postgres-js",
  MYSQL2: "mysql2",
} as const;

export type DatabaseClientTypes = typeof databaseClientTypes;

export type SqliteConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["BETTER_SQLITE3"];
  clientConfig: {
    filename?: string | Buffer;
    options?: Database.Options;
  };
  drizzleConfig: DrizzleConfig<TSchema>;
};

export type LibSqlConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["LIBSQL"];
  clientConfig: LibsqlConfig;
  drizzleConfig: DrizzleConfig<TSchema>;
};

export type PostgresConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["POSTGRES_JS"];
  // TODO: Add Postgres config options as we need
  clientConfig: {};
  drizzleConfig: DrizzleConfig<TSchema>;
};

export type Mysql2Config<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["MYSQL2"];
  // TODO: Add MySQL config options as we need
  clientConfig: {};
  drizzleConfig: MySql2DrizzleConfig<TSchema>;
};

export type DatabaseConfig<TSchema extends DrizzleSchema> = {} & (
  | SqliteConfig<TSchema>
  | LibSqlConfig<TSchema>
  | PostgresConfig<TSchema>
  | Mysql2Config<TSchema>
);

type Options = {
  tag: `${string}:DRIZZLE`;
  isGlobal?: boolean;
};

export type SyncRegisterOptions = Options & {
  dbConfig: DatabaseConfig<any>;
};

export interface DatabaseConfigFactory {
  buildConfig(): Promise<DatabaseConfig<any>> | DatabaseConfig<any>;
}

export type AsyncRegisterOptions = Options & (AsyncRegisterWithFactory | AsyncRegisterWithClass);

type AsyncRegisterWithFactory = {
  useFactory: (...args: any[]) => Promise<DatabaseConfig<any>> | DatabaseConfig<any>;
  inject?: any[];
};

type AsyncRegisterWithClass = {
  useClass: new (...args: any[]) => DatabaseConfigFactory;
};

export type DrizzleSchema = Record<string, any>;
