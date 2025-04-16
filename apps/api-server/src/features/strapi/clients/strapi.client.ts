import { Injectable } from "@nestjs/common";
import { strapi, Strapi } from "@strapi/client";
import { ConfigService } from "src/features/config/config.service";
import type { UserCollection } from "../collections/user.collection";
import type { OAuthAccountCollection } from "../collections/oauth-account.collection";

const STRAPI_COLLECTIONS = {
  USERS: "accounts",
  OAUTH_ACCOUNTS: "oauth-accounts",
} as const;

type StrapiCollections = typeof STRAPI_COLLECTIONS;

type StrapiCollection = StrapiCollections[keyof StrapiCollections];

const STRAPI_SINGLES = {} as const;

type StrapiSingles = typeof STRAPI_SINGLES;

type StrapiSingle = StrapiSingles[keyof StrapiSingles];

type CustomBaseQueryParams<TCollection> = {
  populate?: string | string[] | Record<string, unknown>;

  fields?: (keyof TCollection)[];

  filters?: PartialRecord<keyof TCollection, TCollection[keyof TCollection]>;

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

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type GenericResponse<T> = {
  data: T;
  meta: { pagination?: Pagination };
};

type GenericDocumentResponse<T> = GenericResponse<T>;
type GenericMultiDocumentResponse<T> = GenericResponse<T[]>;

type InferCollection<TStrapiCollection extends StrapiCollection> = TStrapiCollection extends StrapiCollections["USERS"]
  ? UserCollection
  : TStrapiCollection extends StrapiCollections["OAUTH_ACCOUNTS"]
    ? OAuthAccountCollection
    : never;

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

interface CanManageCollection<TCollection> {
  find: (query?: CustomBaseQueryParams<TCollection>) => Promise<GenericMultiDocumentResponse<TCollection>>;
  findOne: (id: string, query?: CustomBaseQueryParams<TCollection>) => Promise<GenericDocumentResponse<TCollection>>;
  create: (
    data: PartialRecord<keyof TCollection, TCollection[keyof TCollection]>,
    query?: CustomBaseQueryParams<TCollection>,
  ) => Promise<GenericDocumentResponse<TCollection>>;
  update: (
    id: string,
    data: PartialRecord<keyof TCollection, TCollection[keyof TCollection]>,
    query?: CustomBaseQueryParams<TCollection>,
  ) => Promise<GenericDocumentResponse<TCollection>>;
  delete: (id: string, query?: CustomBaseQueryParams<TCollection>) => Promise<void>;
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
    return this._client.collection(type) as unknown as CanManageCollection<InferCollection<TCollection>>;
  }

  public getCollection<TCollection extends StrapiCollection>(
    type: TCollection,
  ): CanManageCollection<InferCollection<TCollection>> {
    return this._getTypedCollection(type);
  }

  public getSingle(type: StrapiSingle) {
    return this._client.single(type);
  }

  public static get COLLECTIONS() {
    return STRAPI_COLLECTIONS;
  }

  public async isRunning() {
    try {
      const res = await this._client.fetch("/");
      return res.status === 404;
    } catch (error) {
      const statusCode = (error as { response: Response })?.response?.status;
      return statusCode === 404;
    }
  }
}
