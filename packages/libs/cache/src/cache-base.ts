export type CacheItem<TValue = any> = {
  key: string;
  value: TValue;
  expiresAt?: number;
};

export interface ICacheStore<TValue = any> {
  save(item: CacheItem<TValue>): Promise<void> | void;
  get(key: string): Promise<CacheItem<TValue> | null> | CacheItem<TValue> | null;
  has(key: string): Promise<boolean> | boolean;
  getAll(): Promise<CacheItem<TValue>[]> | CacheItem<TValue>[];
  delete(key: string): Promise<void> | void;
}

export type CacheOptions = {
  expiresIn?: string | number;
};

interface ICache<TValue = any> {
  set(key: string, value: TValue, options: CacheOptions): Promise<void>;
  get(key: string): Promise<TValue | null>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  getAll(): Promise<TValue[]>;
  getAllAsCacheItem(): Promise<CacheItem[]>;
}

export abstract class CacheBase<TValue> implements ICache<TValue> {
  constructor(protected _store: ICacheStore<TValue>) {}

  abstract set(key: string, value: TValue, options: CacheOptions): Promise<void>;
  abstract get(key: string): Promise<TValue | null>;
  abstract delete(key: string): Promise<void>;
  abstract has(key: string): Promise<boolean>;
  abstract getAll(): Promise<TValue[]>;
  abstract getAllAsCacheItem(): Promise<CacheItem[]>;
  protected abstract cleanup(): Promise<void>;
  protected parseExpiresIn(expiresIn: string | number): number {
    if (typeof expiresIn === "number") {
      return expiresIn * 1000;
    }

    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error("Invalid expiresIn format. Use a number or a string like '10s', '5m', '7d'");
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error("Unsupported time unit");
    }
  }
}
