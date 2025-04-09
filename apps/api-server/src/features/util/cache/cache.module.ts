import { CacheService } from "./cache.service";
import { DynamicModule, Module } from "@nestjs/common";
import { ICacheStore } from "@ts-template/cache";
// 
export { MemoryStore, ICacheStore } from "@ts-template/cache";

type CacheServiceName = `${string}:cache`;

type Config = {
  isGlobal?: boolean;
  /**
   * The name of the cache service to be injected. This is used to identify the cache service instance in the DI container.
   * If not provided, the anonymous cache service will be injected.
   * The registered service can be injected using the name in the format `${name}:cache`.
   * ```ts
   * constructor(@Inject("${name}:cache") private _cacheService: CacheService) {}
   * ```
   */
  name?: CacheServiceName;
  /**
   * The cache store to be used. If not provided, a default in-memory store will be used.
   * You can make a custom store by extending the `ICacheStore` interface.
   */
  store?: ICacheStore;
  /**
   * Additional named cache services to be registered in the module.
   */
  additionalServices?: ServiceConfig[];
};

type ServiceConfig = {
  name: CacheServiceName;
  store?: ICacheStore;
};

@Module({
  providers: [CacheService],
})
export class CacheModule {
  static register(options: Config): DynamicModule {
    const { name, store, additionalServices = [] } = options;

    const cacheProvider = {
      provide: name || CacheService,
      useFactory: () => {
        return new CacheService(store);
      },
    };

    const additionalCacheProviders = additionalServices.map((service) => ({
      provide: service.name,
      useFactory: () => {
        return new CacheService(service.store);
      },
    }));

    const providers = [cacheProvider, ...additionalCacheProviders];
    return {
      module: CacheModule,
      global: options.isGlobal,
      controllers: [],
      providers: [...providers],
      exports: providers,
    };
  }
}
