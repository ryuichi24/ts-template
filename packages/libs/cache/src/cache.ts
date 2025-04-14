import { CacheBase, CacheItem, CacheOptions, ICacheStore } from "./cache-base.js";
import { MemoryStore } from "./stores/memory-store.js";

export class Cache<TValue = any> extends CacheBase<TValue> {
  constructor(_store: ICacheStore<TValue> = new MemoryStore<TValue>()) {
    super(_store);
  }

  async set(key: string, value: any, options: CacheOptions): Promise<void> {
    this.cleanup();
    const expiresAt = options.expiresIn ? Date.now() + this.parseExpiresIn(options.expiresIn) : undefined;
    await this._store.save({ key, value, expiresAt });
  }

  async get(key: string): Promise<TValue | null> {
    const entry = await this._store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      await this._store.delete(key);
      return null;
    }

    return entry.value;
  }

  async getAll(): Promise<TValue[]> {
    const items = await this._store.getAll();
    return items.map((entry) => entry.value);
  }

  async getAllAsCacheItem(): Promise<CacheItem[]> {
    return await this._store.getAll();
  }

  async delete(key: string): Promise<void> {
    await this._store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return await this._store.has(key);
  }

  protected async cleanup(): Promise<void> {
    const now = Date.now();
    const items = await this._store.getAll();

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (item.expiresAt && item.expiresAt < now) {
        await this._store.delete(item.key);
      }
    }
  }
}
