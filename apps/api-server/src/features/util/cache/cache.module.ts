import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { CacheController } from './cache.controller';

@Module({
  imports: [],
  exports: [CacheService],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
