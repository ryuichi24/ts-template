import { Injectable } from "@nestjs/common";
import { ConfigService } from "src/features/config/config.service";
import { IOAuthAgent, OAuthPlatformType, OAuthProviderType } from "./OAuthAgent";
import { GoogleOAuthAgent } from "./GoogleOAuthAgent";
import { GithubOAuthAgent } from "./GithubOAuthAgent";
import { DiscordOAuthAgent } from "./DiscordOAuthAgent";

type OAuthProviderAgentOptions = {
  platform: OAuthPlatformType;
  provider: OAuthProviderType;
};

@Injectable()
export class OAuthAgentFactory {
  constructor(private _configService: ConfigService) {}
  create(options: OAuthProviderAgentOptions): IOAuthAgent {
    switch (options.provider.toLowerCase()) {
      case "google":
        return new GoogleOAuthAgent(options.platform, this._configService);
      case "github":
        return new GithubOAuthAgent(options.platform, this._configService);
      case "discord":
        return new DiscordOAuthAgent(options.platform, this._configService);
      default:
        throw new Error("Invalid OAuth Agent");
    }
  }
}
