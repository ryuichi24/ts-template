import { Module } from "@nestjs/common";
import { RefreshTokenCacheController } from "./refresh-token-cache.controller";
import { RefreshTokenCacheService } from "./refresh-token-cache.service";
import { CacheModule } from "../util/cache/cache.module";
import { BetterSqlite3DbStore } from "../cache-util/stores/better-sqlite3-drizzle-db-store";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      tag: "REFRESH_TOKEN:CACHE",
      store: BetterSqlite3DbStore,
    }),
  ],
  controllers: [RefreshTokenCacheController],
  providers: [RefreshTokenCacheService],
})
export class RefreshTokenCacheModule {}
