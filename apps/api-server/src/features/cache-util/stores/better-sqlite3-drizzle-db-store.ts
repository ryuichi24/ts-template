import { Injectable, Inject } from "@nestjs/common";
import { ICacheStore } from "@ts-template/cache";
import { CacheItem } from "node_modules/@ts-template/cache/dist/cjs/cache-base";
import { DrizzleBetterSqlite3Service } from "src/features/util/drizzle/drizzle-better-sqlite3/drizzle-better-sqlite3.service";
import * as betterSqlite3DrizzleSchema from "../../database/drizzle-schema/better-sqlite3/index.js";
import { eq } from "drizzle-orm";

@Injectable()
export class BetterSqlite3DbStore implements ICacheStore {
  constructor(
    @Inject("DB_CLIENT:DRIZZLE")
    private _drizzleClientProvider: DrizzleBetterSqlite3Service<typeof betterSqlite3DrizzleSchema>,
  ) {}

  async save(item: CacheItem<any>): Promise<void> {
    await this._drizzleClientProvider.drizzleClient.insert(betterSqlite3DrizzleSchema.caches).values({
      key: item.key,
      value: JSON.stringify(item.value),
      expiresAt: item.expiresAt!,
    });
  }

  async get(key: string): Promise<CacheItem<any> | null> {
    const cache = await this._drizzleClientProvider.drizzleClient.query.caches.findFirst({
      where: (col, { eq }) => eq(col.key, key),
    });

    if (!cache) {
      return null;
    }
    return cache;
  }

  async has(key: string): Promise<boolean> {
    const cache = await this.get(key);
    if (!cache) {
      return false;
    }
    const now = Date.now();
    if (cache.expiresAt && cache.expiresAt < now) {
      await this.delete(key);
      return false;
    }
    return true;
  }

  async getAll(): Promise<CacheItem<any>[]> {
    const caches = await this._drizzleClientProvider.drizzleClient.query.caches.findMany();
    return caches;
  }

  async delete(key: string): Promise<void> {
    await this._drizzleClientProvider.drizzleClient
      .delete(betterSqlite3DrizzleSchema.caches)
      .where(eq(betterSqlite3DrizzleSchema.caches.key, key));
  }
}
