import { CacheItem, ICacheStore } from "../cache-base.js";

export class MemoryStore<TValue = any> implements ICacheStore<TValue> {
  private store: Map<string, CacheItem<TValue>> = new Map();

  save(item: CacheItem<TValue>): void {
    this.store.set(item.key, item);
  }

  get(key: string): CacheItem<TValue> | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    return entry;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  getAll(): CacheItem<TValue>[] {
    return Array.from(this.store.values());
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}
