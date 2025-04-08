import { Injectable } from "@nestjs/common";
import { OAuthProviderType } from "../agents/oauth-agent";
import { StrapiClient } from "src/features/strapi/clients/strapi.client";
import {
  GetOauthAccountByUserIdAndProviderQuery,
  IOauthAccountManager,
  OAuthAccount,
} from "./oauth-account-base.manager";
import { StrapiBaseWithUUID } from "src/features/strapi/collections/strapi-base.collection";

@Injectable()
export class OAuthAccountManager implements IOauthAccountManager {
  constructor(private _strapiClient: StrapiClient) {}

  public async createOAuthAccount(dto: {
    userId: string;
    provider: OAuthProviderType;
    oauthId: string;
  }): Promise<OAuthAccount> {
    const res = await this._strapiClient.getCollection(StrapiClient.COLLECTIONS.OAUTH_ACCOUNTS).create({
      oauthId: dto.oauthId,
      provider: dto.provider,
      userId: dto.userId,
      uuid: crypto.randomUUID(),
    });

    const { data: newOauthAccount, meta } = res;

    return this._normalizeStrapiCollection(newOauthAccount);
  }

  public async getOAuthAccountByUserIdAndProvider(
    query: GetOauthAccountByUserIdAndProviderQuery,
  ): Promise<OAuthAccount | null> {
    const res = await this._strapiClient.getCollection(StrapiClient.COLLECTIONS.OAUTH_ACCOUNTS).find({
      filters: {
        userId: query.userId,
        provider: query.oauthProvider,
      },
    });

    const { data: foundOauthAccounts, meta } = res;
    const foundOauthAccount = foundOauthAccounts[0];
    if (!foundOauthAccount) {
      return null;
    }

    return this._normalizeStrapiCollection(foundOauthAccount);
  }

  private _normalizeStrapiCollection<TCollection extends StrapiBaseWithUUID>(
    strapiCollection: TCollection,
  ): OAuthAccount {
    const { id, documentId, uuid, publishedAt, ...rest } = strapiCollection;
    return { id: uuid, ...rest } as unknown as OAuthAccount;
  }
}
