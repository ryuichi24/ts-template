import fs from "fs";
import path from "path";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object | undefined
          ? `${K}` | `${K}.${NestedKeyOf<NonNullable<T[K]>>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

type ValueOfNestedKey<T, K extends string> = K extends `${infer P}.${infer Rest}`
  ? P extends keyof T
    ? Rest extends string
      ? ValueOfNestedKey<T[P], Rest>
      : never
    : never
  : K extends keyof T
    ? T[K]
    : never;

export namespace Store {
  export type StoreConfig<TStore> = {
    storePath: string;
    storeFileName: `${string}.json`;
    defaultData?: TStore;
    interceptorGet?: CanIntercept;
    interceptorSet?: CanIntercept;
  };

  export interface CanIntercept {
    intercept(key: string, value: any): Promise<any> | any;
  }
}

export class Store<TStore> {
  private storePath: string;
  private storeData: TStore;
  private interceptorGet?: Store.CanIntercept;
  private interceptorSet?: Store.CanIntercept;

  constructor(config: Store.StoreConfig<TStore>) {
    this.storePath = path.join(config.storePath, config.storeFileName);
    this.storeData = this.loadData(config.defaultData ?? ({} as TStore));
    this.interceptorGet = config.interceptorGet;
    this.interceptorSet = config.interceptorSet;
  }

  private loadData(defaultData: TStore): TStore {
    try {
      if (fs.existsSync(this.storePath)) {
        const rawData = fs.readFileSync(this.storePath, "utf-8");
        return JSON.parse(rawData);
      } else {
        return defaultData;
      }
    } catch (error) {
      console.error("Error loading store data:", error);
      return defaultData;
    }
  }

  private saveData(): void {
    try {
      const data = JSON.stringify(this.storeData, null, 2);
      fs.writeFileSync(this.storePath, data, "utf-8");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  public get<TKey extends NestedKeyOf<TStore>>(key: TKey): ValueOfNestedKey<TStore, TKey> | undefined {
    let value = getNestedProperty<ValueOfNestedKey<TStore, TKey>>(this.storeData, key);

    if (value === undefined || value === null) {
      return undefined;
    }
    if (this.interceptorGet) {
      value = this.interceptorGet.intercept(key, value);
    }
    return value;
  }

  public getOrThrow<TKey extends NestedKeyOf<TStore>>(key: TKey): ValueOfNestedKey<TStore, TKey> {
    const value = this.get<TKey>(key);
    if (value === undefined || value === null) {
      throw new Error(`Config value not found for key: ${key}`);
    }
    return value;
  }

  public async set<TKey extends NestedKeyOf<TStore>>(key: TKey, value: ValueOfNestedKey<TStore, TKey>): Promise<void> {
    if (this.interceptorSet) {
      value = await this.interceptorSet.intercept(key, value);
    }
    setNestedProperty(this.storeData, key, value);
    this.saveData();
  }

  public delete<TKey extends NestedKeyOf<TStore>>(key: TKey): void {
    setNestedProperty(this.storeData, key, null);
    this.saveData();
  }
}

function getNestedProperty<T>(obj: any, key: string): T | undefined {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function setNestedProperty(obj: any, key: string, value: any): void {
  const parts = key.split(".");
  const last = parts.pop()!;
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
}
