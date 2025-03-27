import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/features/auth/guards/auth.guard";
import { CacheService } from "./cache.service";

@Controller("caches")
@UseGuards(AuthGuard)
export class CacheController {
  constructor(private _cacheService: CacheService) {}

  @Get("check/:key")
  public onCacheCheck(@Param("key") cacheKey: string) {
    if (!cacheKey) {
      return { error: "Cache key is required." };
    }
    const cache = this._cacheService.get(cacheKey);

    return { cache };
  }
}
