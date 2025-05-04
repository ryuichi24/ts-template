import { Inject, Injectable } from "@nestjs/common";
import { ICacheStore } from "@ts-template/cache";
import { CacheItem } from "node_modules/@ts-template/cache/dist/cjs/cache-base";
import { NodePostgresDrizzleClientProvider } from "src/features/database/providers/node-postgres-drizzle-client-provider";
import { DrizzleNodePostgresService } from "src/features/util/drizzle/drizzle-node-postgres/drizzle-node-postgres.service";
import * as PgMainSchema from "../../database/drizzle-schema/node-postgres/index.js";
import { eq } from "drizzle-orm";

@Injectable()
export class NodePostgresDrizzleDbStore implements ICacheStore {
  constructor(
    @Inject(NodePostgresDrizzleClientProvider)
    private _drizzleClientProvider: DrizzleNodePostgresService<typeof PgMainSchema>,
  ) {}

  async save(item: CacheItem<any>): Promise<void> {
    await this._drizzleClientProvider.drizzleClient.insert(PgMainSchema.caches).values({
      key: item.key,
      value: JSON.stringify(item.value),
      expiresAt: new Date(item.expiresAt!),
    });
  }

  async get(key: string): Promise<CacheItem<any> | null> {
    const cache = await this._drizzleClientProvider.drizzleClient.query.caches.findFirst({
      where: (col) => eq(col.key, key),
    });

    if (!cache) {
      return null;
    }
    return this._parseCacheItem(cache);
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
    return caches.map((cache) => this._parseCacheItem(cache));
  }

  async delete(key: string): Promise<void> {
    await this._drizzleClientProvider.drizzleClient.delete(PgMainSchema.caches).where(eq(PgMainSchema.caches.key, key));
  }

  private _parseCacheItem(cache: any): any {
    return { ...cache, value: JSON.parse(cache.value) };
  }
}
