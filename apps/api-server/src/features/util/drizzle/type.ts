import Database from "better-sqlite3";
import { DrizzleConfig } from "drizzle-orm";
import { MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import { Config as LibsqlConfig } from "@libsql/client";
import { PoolConfig } from "pg";
import {
  CommonOptionsBase,
  CanBuildConfig,
  SyncRegisterOptionsBase,
  AsyncRegisterOptionsBase,
} from "../configurable-module-base/types";

export type DrizzleSchema = Record<string, any>;

export const databaseClientTypes = {
  BETTER_SQLITE3: "better-sqlite3",
  LIBSQL: "libsql",
  NODE_POSTGRES: "node-postgres",
  POSTGRES_JS: "postgres-js",
  MYSQL2: "mysql2",
} as const;

type DatabaseClientTypes = typeof databaseClientTypes;

type SqliteConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["BETTER_SQLITE3"];
  clientConfig: {
    filename?: string | Buffer;
    options?: Database.Options;
  };
  drizzleConfig: DrizzleConfig<TSchema>;
};

type LibSqlConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["LIBSQL"];
  clientConfig: LibsqlConfig;
  drizzleConfig: DrizzleConfig<TSchema>;
};

type NodePostgresConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["NODE_POSTGRES"];
  clientConfig: PoolConfig;
  drizzleConfig: DrizzleConfig<TSchema>;
};

type PostgresJSConfig<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["POSTGRES_JS"];
  // TODO: Add Postgres config options as we need
  clientConfig: {};
  drizzleConfig: DrizzleConfig<TSchema>;
};

type Mysql2Config<TSchema extends DrizzleSchema> = {
  clientType: DatabaseClientTypes["MYSQL2"];
  // TODO: Add MySQL config options as we need
  clientConfig: {};
  drizzleConfig: MySql2DrizzleConfig<TSchema>;
};

export type DatabaseConfig<TSchema extends DrizzleSchema> = {} & (
  | SqliteConfig<TSchema>
  | LibSqlConfig<TSchema>
  | NodePostgresConfig<TSchema>
  | PostgresJSConfig<TSchema>
  | Mysql2Config<TSchema>
);

export type DrizzleServiceSyncConfig = {};

export type DrizzleServiceAsyncConfig = {
  dbConfig: DatabaseConfig<any>;
};

type DrizzleCommonOptions = CommonOptionsBase & {
  tag: `${string}:DRIZZLE` | symbol;
};

export type SyncRegisterDrizzleOptions = SyncRegisterOptionsBase<DrizzleServiceSyncConfig, DrizzleCommonOptions> & {
  dbConfig: DatabaseConfig<any>;
};

export type AsyncRegisterDrizzleOptions = AsyncRegisterOptionsBase<DrizzleServiceAsyncConfig, DrizzleCommonOptions>;

export interface IConfigBuilder extends CanBuildConfig<DrizzleServiceAsyncConfig> {}
