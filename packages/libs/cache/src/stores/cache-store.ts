import { CacheItem } from "../cache-base.js";

export interface ICacheStore<TValue = any> {
  save(item: CacheItem<TValue>): Promise<void>;
  get(key: string): Promise<CacheItem<TValue> | null>;
  has(key: string): Promise<boolean> | boolean;
  getAll(): Promise<CacheItem<TValue>[]>;
  delete(key: string): Promise<void>;
}
