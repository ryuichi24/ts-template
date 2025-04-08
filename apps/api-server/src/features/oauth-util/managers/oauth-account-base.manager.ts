import { OAuthProviderType } from "../agents/oauth-agent";

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

export interface IOauthAccountManager {
  createOAuthAccount(dto: { userId: string; provider: OAuthProviderType; oauthId: string }): Promise<OAuthAccount>;
  getOAuthAccountByUserIdAndProvider(query: GetOauthAccountByUserIdAndProviderQuery): Promise<OAuthAccount | null>;
}
