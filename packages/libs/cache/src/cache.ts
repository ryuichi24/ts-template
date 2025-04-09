import { CacheBase, CacheItem, CacheOptions, ICacheStore } from "./cache-base.js";
import { MemoryStore } from "./stores/memory-store.js";

export class Cache<TValue = any> extends CacheBase<TValue> {
  constructor(_store: ICacheStore<TValue> = new MemoryStore<TValue>()) {
    super(_store);
  }

  set(key: string, value: any, options: CacheOptions): void {
    this.cleanup();
    const expiresAt = options.expiresIn ? Date.now() + this.parseExpiresIn(options.expiresIn) : undefined;
    this._store.save({ key, value, expiresAt });
  }

  get(key: string): TValue | null {
    const entry = this._store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this._store.delete(key);
      return null;
    }

    return entry.value;
  }

  getAll(): TValue[] {
    return this._store.getAll().map((entry) => entry.value);
  }

  getAllAsCacheItem(): CacheItem[] {
    return this._store.getAll();
  }

  delete(key: string): boolean {
    return this._store.delete(key);
  }

  has(key: string): boolean {
    return this._store.has(key);
  }

  protected cleanup(): void {
    const now = Date.now();
    this._store.getAll().forEach((entry) => {
      if (entry.expiresAt && entry.expiresAt < now) {
        this._store.delete(entry.key);
      }
    });
  }
}
