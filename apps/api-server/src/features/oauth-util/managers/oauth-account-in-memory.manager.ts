import crypto from "crypto";
import { Injectable } from "@nestjs/common";
import { OAuthProviderType } from "../agents/oauth-agent";
import { IOauthAccountManager } from "./oauth-account-base.manager";

export namespace OAuthAccountManager {
  export type OAuthAccount = {
    id: string;
    userId: string;
    provider: OAuthProviderType;
    oauthId: string;
    createdAt: Date;
  };

  export type GetOauthAccountByUserIdAndProviderQuery = {
    userId: string;
    oauthProvider: OAuthProviderType;
  };
}

@Injectable()
export class OAuthAccountManager implements IOauthAccountManager {
  private _oauthAccount: OAuthAccountManager.OAuthAccount[];

  constructor() {
    this._oauthAccount = [];
  }

  public async createOAuthAccount(dto: {
    userId: string;
    provider: OAuthProviderType;
    oauthId: string;
  }): Promise<OAuthAccountManager.OAuthAccount> {
    const newOAuthAccount = {
      id: crypto.randomUUID(),
      userId: dto.userId,
      provider: dto.provider,
      oauthId: dto.oauthId,
      createdAt: new Date(),
    };

    this._oauthAccount.push(newOAuthAccount);

    return newOAuthAccount;
  }

  public async getOAuthAccountByUserIdAndProvider(
    query: OAuthAccountManager.GetOauthAccountByUserIdAndProviderQuery,
  ): Promise<OAuthAccountManager.OAuthAccount | null> {
    const oauthAccount = this._oauthAccount.find(
      (account) => account.userId === query.userId && account.provider === query.oauthProvider,
    );

    return oauthAccount || null;
  }
}
