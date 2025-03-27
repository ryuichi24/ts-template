import { ConfigService } from "src/features/config/config.service";
import { OAuthAgent, OAuthPlatformType, OAuthTokenResponse } from "./OAuthAgent";

export class DiscordOAuthAgent extends OAuthAgent {
  constructor(
    platform: OAuthPlatformType,
    private _configService: ConfigService,
  ) {
    super(platform);
  }
  public makeLoginUrl(): string {
    throw new Error("Method not implemented.");
  }
  public makeLoginSuccessUrl(): string {
    throw new Error("Method not implemented.");
  }
  public getAuthTokens(code: string): Promise<OAuthTokenResponse> {
    throw new Error("Method not implemented.");
  }
  public fetchUserInfo(accessToken: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
