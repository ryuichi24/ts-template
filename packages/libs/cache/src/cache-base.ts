export type CacheItem<TValue = any> = {
  key: string;
  value: TValue;
  expiresAt?: number;
};

export interface ICacheStore<TValue = any> {
  save(item: CacheItem<TValue>): void;
  get(key: string): CacheItem<TValue> | null;
  has(key: string): boolean;
  getAll(): CacheItem<TValue>[];
  delete(key: string): boolean;
}

export type CacheOptions = {
  expiresIn?: string | number;
};

interface ICache<TValue = any> {
  set(key: string, value: TValue, options: CacheOptions): void;
  get(key: string): TValue | null;
  delete(key: string): boolean;
  has(key: string): boolean;
  getAll(): TValue[];
  getAllAsCacheItem(): CacheItem[];
}

export abstract class CacheBase<TValue> implements ICache<TValue> {
  constructor(protected _store: ICacheStore<TValue>) {}

  abstract set(key: string, value: TValue, options: CacheOptions): void;
  abstract get(key: string): TValue | null;
  abstract delete(key: string): boolean;
  abstract has(key: string): boolean;
  abstract getAll(): TValue[];
  abstract getAllAsCacheItem(): CacheItem[];
  protected abstract cleanup(): void;
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
