import { Injectable } from "@nestjs/common";
import { OauthAccountRepository } from "./oauth-account.repository";
import { StrapiClient } from "src/features/strapi/clients/strapi.client";
import { StrapiRepository } from "src/features/strapi/repositories/strapi.repository";

@Injectable()
export class OauthAccountStrapiRepository extends StrapiRepository implements OauthAccountRepository {
  constructor(private _strapiClient: StrapiClient) {
    super();
  }

  async create(cmd: OauthAccountRepository.CreateCommand): Promise<OauthAccountRepository.OAuthAccount> {
    const res = await this._strapiClient.getCollection(StrapiClient.COLLECTIONS.OAUTH_ACCOUNTS).create({
      ...cmd,
      uuid: crypto.randomUUID(),
    });

    const { data: newOauthAccount, meta } = res;

    return this._normalizeStrapiCollection(newOauthAccount) as OauthAccountRepository.OAuthAccount;
  }

  async getByUserIdAndProvider(
    query: OauthAccountRepository.GetByUserIdAndProviderQuery,
  ): Promise<OauthAccountRepository.OAuthAccount | null> {
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

    return this._normalizeStrapiCollection(foundOauthAccount) as OauthAccountRepository.OAuthAccount;
  }
}
