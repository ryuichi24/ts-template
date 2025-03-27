import { Module } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthController } from "./oauth.controller";
import { JwtModule } from "@nestjs/jwt";
import { OAuthAgentFactory } from "./agents/OAuthAgentFactory";
import { CacheModule } from "../util/cache/cache.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [JwtModule.register({ global: true }), CacheModule, UserModule],
  providers: [OauthService, OAuthAgentFactory],
  controllers: [OauthController],
})
export class OauthModule {}
