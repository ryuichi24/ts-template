import { Injectable } from "@nestjs/common";
import { strapi, Strapi } from "@strapi/client";
import { ConfigService } from "src/features/config/config.service";
import type { UserCollection } from "../collections/user.collection";
import type { OAuthAccountCollection } from "../collections/oauth-account.collection";

type StrapiCollection = "user" | "oauth-account";
type StrapiSingle = "";

type CustomBaseQueryParams<TCollection> = {
  populate?: string | string[] | Record<string, unknown>;

  fields?: (keyof TCollection)[];

  filters?: Record<keyof TCollection, TCollection[keyof TCollection]>;

  locale?: string;

  status?: "draft" | "published";

  sort?: string | string[];

  pagination?: {
    page?: number;
    pageSize?: number;
    withCount?: boolean;
    start?: number;
    limit?: number;
  };
};

type InferCollection<TStrapiCollection extends StrapiCollection> = TStrapiCollection extends "user"
  ? UserCollection
  : TStrapiCollection extends "oauth-account"
    ? OAuthAccountCollection
    : never;

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

interface CanManageCollection<TCollection> {
  find: (query?: CustomBaseQueryParams<TCollection>) => Promise<any>;
  findOne: (id: string, query?: CustomBaseQueryParams<TCollection>) => Promise<any>;
  create: (
    data: PartialRecord<keyof TCollection, TCollection[keyof TCollection]>,
    query?: CustomBaseQueryParams<TCollection>,
  ) => Promise<any>;
  update: (
    id: string,
    data: PartialRecord<keyof TCollection, TCollection[keyof TCollection]>,
    query?: CustomBaseQueryParams<TCollection>,
  ) => Promise<any>;
  delete: (id: string, query?: CustomBaseQueryParams<TCollection>) => Promise<any>;
}

@Injectable()
export class StrapiClient {
  private _client: Strapi;
  constructor(private _configService: ConfigService) {
    const baseURL = this._configService.getOrThrow("api.strapi.baseUrl", { infer: true });
    const token = this._configService.getOrThrow("api.strapi.token", { infer: true });

    this._client = strapi({
      baseURL,
      auth: token,
    });
  }

  private _getTypedCollection<TCollection extends StrapiCollection>(
    type: TCollection,
  ): CanManageCollection<InferCollection<TCollection>> {
    return this._client.collection(type) as CanManageCollection<InferCollection<TCollection>>;
  }

  public getCollection<TCollection extends StrapiCollection>(
    type: TCollection,
  ): CanManageCollection<InferCollection<TCollection>> {
    return this._getTypedCollection(type);
  }

  public getSingle(type: StrapiSingle) {
    return this._client.single(type);
  }
}
