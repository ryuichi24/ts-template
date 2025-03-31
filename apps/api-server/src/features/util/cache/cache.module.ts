import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { CacheController } from './cache.controller';
import { CacheManager } from "./cache.manager";

@Module({
  imports: [],
  exports: [CacheManager],
  controllers: [CacheController],
  providers: [CacheService, CacheManager],
})
export class CacheModule {}
