import { Module } from "@nestjs/common";
import { RefreshTokenCacheController } from "./refresh-token-cache.controller";
import { RefreshTokenCacheService } from "./refresh-token-cache.service";
import { CacheModule } from "../util/cache/cache.module";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      name: "refresh-token-cache:cache",
    }),
  ],
  controllers: [RefreshTokenCacheController],
  providers: [RefreshTokenCacheService],
})
export class RefreshTokenCacheModule {}
