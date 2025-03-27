import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/features/auth/guards/auth.guard";
import { CacheService } from "./cache.service";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";

@Controller("caches")
@UseGuards(AuthGuard)
@ApiBearerAuth("Access Token")
export class CacheController {
  constructor(private _cacheService: CacheService) {}

  @Get(":key")
  @ApiParam({ name: "key", type: String, required: true })
  public onCacheCheck(@Param("key") cacheKey: string) {
    if (!cacheKey) {
      return { error: "Cache key is required." };
    }
    const cache = this._cacheService.get(cacheKey);

    return { cache };
  }
}
