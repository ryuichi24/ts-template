import { CacheService } from "./cache.service";
import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ICacheStore } from "@ts-template/cache";
import { AsyncRegisterCacheOptions, CacheServiceAsyncConfig, SyncRegisterCacheOptions } from "./type";
export { MemoryStore, ICacheStore } from "@ts-template/cache";

@Module({
  providers: [CacheService],
})
export class CacheModule {
  static register(options: SyncRegisterCacheOptions): DynamicModule {
    const cacheProvider: Provider = {
      provide: options.tag || CacheService,
      useFactory: (store: ICacheStore) => {
        return new CacheService(store);
      },
      inject: [options.store],
    };

    return {
      module: CacheModule,
      global: options.isGlobal,
      controllers: [],
      providers: [cacheProvider, options.store],
      exports: [cacheProvider],
    };
  }

  static registerAsync(options: AsyncRegisterCacheOptions): DynamicModule {
    const configToken = `${options.tag ?? "default"}:config`;

    const providers: Provider[] = [];

    if ("useClass" in options) {
      const configProvider = {
        provide: configToken,
        useFactory: async (factory: any) => await factory.buildConfig(),
        inject: [options.useClass],
      };
      providers.push(configProvider);
      providers.push(options.useClass);
    }

    if ("useFactory" in options) {
      const configProvider = {
        provide: configToken,
        useFactory: options.useFactory,
        inject: [...(options.inject || [])],
      };
      providers.push(configProvider);
      providers.push(...(options.inject ?? []));
    }

    return {
      module: CacheModule,
      global: options.isGlobal,
      providers: [
        ...providers,
        {
          provide: options.tag || CacheService,
          useFactory: async (config: CacheServiceAsyncConfig) => {
            return new CacheService(config.store);
          },
          inject: [configToken],
        },
      ],
      exports: [options.tag || CacheService],
    };
  }
}
