import { Module } from "@nestjs/common";
import { RefreshTokenService } from "./services/refresh-token/refresh-token.service";
import { CacheModule } from "../util/cache/cache.module";
import { RefreshTokenCache } from "./cache/refresh-token-cache";
import { BetterSqlite3DbStore } from "../cache-util/stores/better-sqlite3-drizzle-db-store";
import { NodePostgresDrizzleDbStore } from "../cache-util/stores/node-postgres-drizzle-db-store";

@Module({
  providers: [RefreshTokenService],
  imports: [
    CacheModule.register({
      tag: RefreshTokenCache,
      // store: BetterSqlite3DbStore,
      store: NodePostgresDrizzleDbStore,
    }),
  ],
  exports: [RefreshTokenService],
})
export class AuthUtilModule {}
