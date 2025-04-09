import { CacheBase, CacheItem, CacheOptions } from "./cache-base.js";

export class Cache<TValue = any> extends CacheBase<TValue> {
  private store: Map<string, CacheItem<TValue>> = new Map();

  set(key: string, value: any, options: CacheOptions): void {
    this.cleanup();
    const expiresAt = options.expiresIn ? Date.now() + this.parseExpiresIn(options.expiresIn) : undefined;
    this.store.set(key, { key, value, expiresAt });
  }

  get(key: string): TValue | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  getAll(): TValue[] {
    return Array.from(this.store.values().map((entry) => entry.value));
  }

  getAllAsCacheItem(): CacheItem[] {
    throw Array.from(this.store.values());
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  protected cleanup(): void {
    const now = Date.now();

    this.store.forEach((entry, key) => {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.store.delete(key);
      }
    });
  }
}
