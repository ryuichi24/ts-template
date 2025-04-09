import { Module } from "@nestjs/common";
import { AuthModule } from "./features/auth/auth.module";
import { ConfigModule } from "./features/config/config.module.js";
import { OauthModule } from "./features/oauth/oauth.module";
import { UserModule } from "./features/user/user.module";
import { CacheModule } from "./features/util/cache/cache.module";
import { RefreshTokenCacheModule } from "./features/refresh-token-cache/refresh-token-cache.module";

@Module({
  imports: [AuthModule, OauthModule, UserModule, ConfigModule, CacheModule, RefreshTokenCacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
