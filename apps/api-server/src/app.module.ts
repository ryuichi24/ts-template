import { Module } from "@nestjs/common";
import { AuthModule } from "./features/auth/auth.module";
import { ConfigModule } from "./features/config/config.module.js";
import { OauthModule } from "./features/oauth/oauth.module";
import { UserModule } from "./features/user/user.module";
import { CacheModule } from "./features/util/cache/cache.module";

@Module({
  imports: [ConfigModule, AuthModule, OauthModule, UserModule, CacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
