import { ConfigService } from "src/features/config/config.service";
import { OAuthAgent, OAuthPlatformType, OAuthTokenResponse } from "./oauth-agent";

export class DiscordOAuthAgent extends OAuthAgent {
  constructor(
    platform: OAuthPlatformType,
    private _configService: ConfigService,
  ) {
    super(platform);
  }

  makeLoginUrl(): string {
    throw new Error("Method not implemented.");
  }
  makeLoginSuccessUrl(payload: {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
  }): string {
    throw new Error("Method not implemented.");
  }
  getAuthTokens(code: string): Promise<OAuthTokenResponse> {
    throw new Error("Method not implemented.");
  }
  fetchUserInfo(accessToken: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
