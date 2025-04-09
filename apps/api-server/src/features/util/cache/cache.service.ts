import { Injectable } from "@nestjs/common";
import { CacheManager } from "./cache.manager";

@Injectable()
export class CacheService {
  constructor(private _cacheManager: CacheManager) {}

  public onCacheCheck(cacheCheckDto: { key: string }) {
    const { key } = cacheCheckDto;
    if (!key) {
      return { error: "Cache key is required." };
    }
    const cache = this._cacheManager.get(key);

    return { cache };
  }

  public onCacheCheckAll() {
    const caches = this._cacheManager.getAllAsCacheItem();
    return { caches };
  }
}
