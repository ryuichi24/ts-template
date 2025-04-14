import { Module } from "@nestjs/common";
import { AuthModule } from "./features/auth/auth.module";
import { ConfigModule } from "./features/config/config.module.js";
import { OauthModule } from "./features/oauth/oauth.module";
import { UserModule } from "./features/user/user.module";
import { RefreshTokenCacheModule } from "./features/refresh-token-cache/refresh-token-cache.module";
import { DatabaseModule } from "./features/database/database.module";
import { OauthTokenCacheModule } from "./features/oauth-token-cache/oauth-token-cache.module";

@Module({
  imports: [
    AuthModule,
    OauthModule,
    UserModule,
    ConfigModule,
    DatabaseModule,
    RefreshTokenCacheModule,
    OauthTokenCacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
