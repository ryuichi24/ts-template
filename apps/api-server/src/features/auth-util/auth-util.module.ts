import { Module } from "@nestjs/common";
import { RefreshTokenManager } from "./managers/refresh-token.manager";
import { CacheModule } from "../util/cache/cache.module";

@Module({
  exports: [RefreshTokenManager],
  imports: [CacheModule],
  providers: [RefreshTokenManager],
})
export class AuthUtilModule {}
