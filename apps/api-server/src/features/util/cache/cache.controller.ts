import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/features/auth-util/guards/auth.guard";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { CacheService } from "./cache.service";
import { RoleGuard } from "src/features/auth-util/guards/role.guard";
import { Roles } from "src/features/auth-util/decorators/roles.decorator";

@Controller("caches")
@UseGuards(AuthGuard, RoleGuard)
@Roles(['admin'])
@ApiBearerAuth("Authorization")
export class CacheController {
  constructor(private _cacheService: CacheService) {}

  @Get(":key")
  @ApiParam({ name: "key", type: String, required: true })
  public onCacheCheck(@Param("key") cacheKey: string) {
    const res = this._cacheService.onCacheCheck({ key: cacheKey });
    return { cache: res.cache };
  }

  @Get()
  public onCacheCheckAll() {
    const res = this._cacheService.onCacheCheckAll();
    return { caches: res.caches };
  }
}
