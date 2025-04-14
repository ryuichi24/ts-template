import { DynamicModule, Module, Provider } from "@nestjs/common";
import { DrizzleBetterSqlite3Service } from "./drizzle-better-sqlite3/drizzle-better-sqlite3.service";
import { DrizzlePostgresJsService } from "./drizzle-postgres-js/drizzle-postgres-js.service";
import { DrizzleMysql2Service } from "./drizzle-mysql2/drizzle-mysql2.service";
import {
  databaseClientTypes,
  DatabaseConfig,
  SyncRegisterOptions,
  AsyncRegisterOptions,
  DatabaseConfigFactory,
} from "./type";
import { DrizzleLibsqlService } from "./drizzle-libsql/drizzle-libsql.service";

@Module({})
export class DrizzleModule {
  static register(options: SyncRegisterOptions): DynamicModule {
    const { tag, isGlobal, dbConfig } = options;

    const provider: Provider = {
      provide: tag,
      useFactory: () => {
        const dbClient = this._createDbClient(dbConfig);
        return dbClient;
      },
    };

    return {
      global: isGlobal,
      module: DrizzleModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static registerAsync(options: AsyncRegisterOptions): DynamicModule {
    const { tag, isGlobal, ...rest } = options;
    const dbConfigToken = `${tag}:dbConfig`;

    let configProvider: Provider;

    if ("useClass" in rest) {
      configProvider = {
        provide: dbConfigToken,
        useFactory: async (factory: DatabaseConfigFactory) => await factory.buildConfig(),
        inject: [rest.useClass],
      };
    }

    if ("useFactory" in rest) {
      configProvider = {
        provide: dbConfigToken,
        useFactory: rest.useFactory,
        inject: [...(rest.inject || [])],
      };
    }

    return {
      global: isGlobal,
      module: DrizzleModule,
      imports: [],
      providers: [
        configProvider!,
        {
          provide: tag,
          useFactory: async (dbConfig: DatabaseConfig<any>) => {
            const client = this._createDbClient(dbConfig);
            return client;
          },
          inject: [dbConfigToken],
        },
      ],
      exports: [tag],
      controllers: [],
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
