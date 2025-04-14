import { Module } from "@nestjs/common";
import { CacheModule, ICacheStore } from "../util/cache/cache.module";
import { BetterSqlite3DbStore } from "../cache-util/stores/better-sqlite3-drizzle-db-store";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      tag: "OAUTH_TOKEN:CACHE",
      store: BetterSqlite3DbStore,
    }),
  ],
  controllers: [],
  providers: [],
})
export class OauthTokenCacheModule {}
