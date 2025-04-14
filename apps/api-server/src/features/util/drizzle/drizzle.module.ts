import { DynamicModule, Module, Provider } from "@nestjs/common";
import { DrizzleBetterSqlite3Service } from "./drizzle-better-sqlite3/drizzle-better-sqlite3.service";
import { DrizzlePostgresJsService } from "./drizzle-postgres-js/drizzle-postgres-js.service";
import { DrizzleMysql2Service } from "./drizzle-mysql2/drizzle-mysql2.service";
import {
  SyncRegisterDrizzleOptions,
  AsyncRegisterDrizzleOptions,
  databaseClientTypes,
  DatabaseConfig,
  DrizzleConfigFactory,
} from "./type";
import { DrizzleLibsqlService } from "./drizzle-libsql/drizzle-libsql.service";

@Module({})
export class DrizzleModule {
  static register(options: SyncRegisterDrizzleOptions): DynamicModule {
    const { tag, isGlobal, dbConfig } = options;

    const provider: Provider = {
      provide: tag,
      useFactory: () => {
        const dbClient = this._createDbClient(dbConfig);
        return dbClient;
      },
    };

    return {
      module: DrizzleModule,
      global: isGlobal,
      providers: [provider],
      exports: [provider],
    };
  }

  static registerAsync(options: AsyncRegisterDrizzleOptions): DynamicModule {
    const dbConfigToken = `${options.tag ?? "DEFAULT"}:DRIZZLE_CONFIG`;

    const providers: Provider[] = [];

    if ("useClass" in options) {
      const configProvider = {
        provide: dbConfigToken,
        useFactory: async (factory: DrizzleConfigFactory) => await factory.buildConfig(),
        inject: [options.useClass],
      };
      providers.push(configProvider);
    }

    if ("useFactory" in options) {
      const configProvider = {
        provide: dbConfigToken,
        useFactory: options.useFactory,
        inject: [...(options.inject || [])],
      };
      providers.push(configProvider);
      providers.push(...(options.inject ?? []));
    }

    return {
      module: DrizzleModule,
      global: options.isGlobal,
      providers: [
        ...providers,
        {
          provide: options.tag,
          useFactory: async (dbConfig: DatabaseConfig<any>) => {
            const client = this._createDbClient(dbConfig);
            return client;
          },
          inject: [dbConfigToken],
        },
      ],
      exports: [options.tag],
    };
  }

  private static _createDbClient(config: DatabaseConfig<any>) {
    let drizzleClient;

    switch (config.clientType) {
      case databaseClientTypes.BETTER_SQLITE3:
        drizzleClient = new DrizzleBetterSqlite3Service(config);
        break;
      case databaseClientTypes.LIBSQL:
        drizzleClient = new DrizzleLibsqlService(config);
        break;
      case databaseClientTypes.POSTGRES_JS:
        drizzleClient = new DrizzlePostgresJsService(config);
        break;
      case databaseClientTypes.MYSQL2:
        drizzleClient = new DrizzleMysql2Service(config);
        break;
      default:
        throw new Error("Unsupported client type");
    }

    return drizzleClient;
  }
}
