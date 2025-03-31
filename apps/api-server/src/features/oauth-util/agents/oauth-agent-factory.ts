import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/features/config/config.service";
import { IOAuthAgent, OAuthPlatformType, OAuthProviderType } from "./oauth-agent";
import { GoogleOAuthAgent } from "./google-oauth-agent";
import { GithubOAuthAgent } from "./github-oauth-agent";
import { DiscordOAuthAgent } from "./discord-oauth-agent";
import { GoogleOauthApiClient } from "../clients/google-oauth-api-client";

type OAuthProviderAgentOptions = {
  platform: OAuthPlatformType;
  provider: OAuthProviderType;
};

@Injectable()
export class OAuthAgentFactory {
  constructor(
    private _configService: ConfigService,
    private _googleOAuthApiClient: GoogleOauthApiClient,
  ) {}
  create(options: OAuthProviderAgentOptions): IOAuthAgent {
    switch (options.provider.toLowerCase()) {
      case "google":
        return new GoogleOAuthAgent(options.platform, this._configService, this._googleOAuthApiClient);
      case "github":
        return new GithubOAuthAgent(options.platform, this._configService);
      case "discord":
        return new DiscordOAuthAgent(options.platform, this._configService);
      default:
        throw new Error("Invalid OAuth Agent");
    }
  }
}
