import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { Roles } from "../auth-util/decorators/roles.decorator";
import { AuthGuard } from "../auth-util/guards/auth.guard";
import { RoleGuard } from "../auth-util/guards/role.guard";
import { RefreshTokenCacheService } from "./refresh-token-cache.service";

@Controller("refresh-token-caches")
@UseGuards(AuthGuard, RoleGuard)
@Roles(["admin"])
@ApiBearerAuth("Authorization")
export class RefreshTokenCacheController {
  constructor(private _cacheService: RefreshTokenCacheService) {}

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
