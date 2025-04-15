import { ICacheStore } from "@ts-template/cache";
import {
  CommonOptionsBase,
  CanBuildConfig,
  SyncRegisterOptionsBase,
  AsyncRegisterOptionsBase,
} from "../configurable-module-base/types";

export type CacheServiceSyncConfig = {
  /**
   * The cache store to be used. If not provided, a default in-memory store will be used.
   * You can make a custom store by extending the `ICacheStore` interface.
   */
  store: new (...args: any[]) => ICacheStore<any>;
};

export type CacheServiceAsyncConfig = {
  store: ICacheStore<any>;
};

type CacheCommonOptions = CommonOptionsBase & {
  /**
   * The tag of the cache service to be injected. This is used to identify the cache service instance in the DI container.
   * If not provided, the anonymous cache service will be injected.
   * The registered service can be injected using the name in the format `${tag}:cache`.
   * ```ts
   * constructor(@Inject("${tag}:cache") private _cacheService: CacheService) {}
   * ```
   */
  tag: `${string}:CACHE` | symbol;
};

export type SyncRegisterCacheOptions = SyncRegisterOptionsBase<CacheServiceSyncConfig, CacheCommonOptions>;

export type AsyncRegisterCacheOptions = AsyncRegisterOptionsBase<CacheServiceAsyncConfig, CacheCommonOptions>;

export class CacheConfigFactory implements CanBuildConfig<CacheServiceAsyncConfig> {
  buildConfig(): CacheServiceAsyncConfig | Promise<CacheServiceAsyncConfig> {
    throw new Error("Method not implemented.");
  }
}
