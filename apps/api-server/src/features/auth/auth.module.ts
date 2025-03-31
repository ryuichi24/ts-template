import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CacheModule } from "../util/cache/cache.module";
import { AuthUtilModule } from "../auth-util/auth-util.module";
import { OauthUtilModule } from "../oauth-util/oauth-util.module";
import { UserUtilModule } from "../user-util/user-util.module";

@Module({
  imports: [AuthUtilModule, OauthUtilModule, UserUtilModule, CacheModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
