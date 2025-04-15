import { Module } from "@nestjs/common";
import { AuthModule } from "./features/auth/auth.module";
import { ConfigModule } from "./features/config/config.module.js";
import { OauthModule } from "./features/oauth/oauth.module";
import { UserModule } from "./features/user/user.module";
import { DatabaseModule } from "./features/database/database.module";

@Module({
  imports: [AuthModule, OauthModule, UserModule, ConfigModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
