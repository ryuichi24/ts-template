import { Inject, Injectable } from "@nestjs/common";
import { CacheService } from "../util/cache/cache.service";


@Injectable()
export class RefreshTokenCacheService {
  constructor(@Inject("refresh-token-cache:cache") private _cacheService: CacheService) {}

  public onCacheCheck(cacheCheckDto: { key: string }) {
    const { key } = cacheCheckDto;
    if (!key) {
      return { error: "Cache key is required." };
    }
    const cache = this._cacheService.get(key);

    return { cache };
  }

  public onCacheCheckAll() {
    const caches = this._cacheService.getAllAsCacheItem();
    return { caches };
  }
}
