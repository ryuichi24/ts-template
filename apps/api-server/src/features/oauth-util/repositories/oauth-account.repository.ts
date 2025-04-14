import { OAuthProviderType } from "../agents/oauth-agent";

export namespace OauthAccountRepository {
  export type OAuthAccount = {
    id: string;
    userId: string;
    provider: OAuthProviderType;
    oauthId: string;
    createdAt: Date;
  };

  export type CreateCommand = { userId: string; provider: OAuthProviderType; oauthId: string };

  export type GetByUserIdAndProviderQuery = {
    userId: string;
    oauthProvider: OAuthProviderType;
  };
}

export interface OauthAccountRepository {
  create(cmd: OauthAccountRepository.CreateCommand): Promise<OauthAccountRepository.OAuthAccount>;
  getByUserIdAndProvider(
    query: OauthAccountRepository.GetByUserIdAndProviderQuery,
  ): Promise<OauthAccountRepository.OAuthAccount | null>;
}

// https://stackoverflow.com/a/70088972
export const OauthAccountRepository = Symbol("OauthAccountRepository");
