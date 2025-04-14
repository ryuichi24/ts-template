import { Injectable } from "@nestjs/common";
import { OauthAccountRepository } from "./oauth-account.repository";

@Injectable()
export class OauthAccountInMemoryRepository implements OauthAccountRepository {
  private _oauthAccount: OauthAccountRepository.OAuthAccount[];

  constructor() {
    this._oauthAccount = [];
  }

  async create(cmd: OauthAccountRepository.CreateCommand): Promise<OauthAccountRepository.OAuthAccount> {
    const newOAuthAccount = {
      id: crypto.randomUUID(),
      ...cmd,
      createdAt: new Date(),
    };

    this._oauthAccount.push(newOAuthAccount);

    return newOAuthAccount;
  }

  async getByUserIdAndProvider(
    query: OauthAccountRepository.GetByUserIdAndProviderQuery,
  ): Promise<OauthAccountRepository.OAuthAccount | null> {
    const oauthAccount = this._oauthAccount.find(
      (account) => account.userId === query.userId && account.provider === query.oauthProvider,
    );

    return oauthAccount || null;
  }
}
