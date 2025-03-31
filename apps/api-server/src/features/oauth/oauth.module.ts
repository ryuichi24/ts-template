import { Module } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthController } from "./oauth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AuthUtilModule } from "../auth-util/auth-util.module";
import { OauthUtilModule } from "../oauth-util/oauth-util.module";
import { UserUtilModule } from "../user-util/user-util.module";

@Module({
  imports: [OauthUtilModule, AuthUtilModule, UserUtilModule, JwtModule.register({ global: true })],
  providers: [OauthService],
  controllers: [OauthController],
})
export class OauthModule {}
