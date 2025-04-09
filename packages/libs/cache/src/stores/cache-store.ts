import { CacheItem } from "../cache-base.js";

export interface ICacheStore<TValue = any> {
  save(item: CacheItem<TValue>): void;
  get(key: string): CacheItem<TValue> | null;
  has(key: string): boolean;
  getAll(): CacheItem<TValue>[];
  delete(key: string): boolean;
}
