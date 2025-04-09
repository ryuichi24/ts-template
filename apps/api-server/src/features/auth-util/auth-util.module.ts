import { Module } from "@nestjs/common";
import { RefreshTokenManager } from "./managers/refresh-token.manager";

@Module({
  exports: [RefreshTokenManager],
  imports: [],
  providers: [RefreshTokenManager],
})
export class AuthUtilModule {}
