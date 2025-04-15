import { Module } from "@nestjs/common";
import { RefreshTokenService } from "./services/refresh-token/refresh-token.service";
import { CacheModule } from "../util/cache/cache.module";
import { BetterSqlite3DbStore } from "../cache-util/stores/better-sqlite3-drizzle-db-store";
import { RefreshTokenCache } from "./cache/refresh-token-cache";

@Module({
  providers: [RefreshTokenService],
  imports: [
    CacheModule.register({
      tag: RefreshTokenCache,
      store: BetterSqlite3DbStore,
    }),
  ],
  exports: [RefreshTokenService],
})
export class AuthUtilModule {}
