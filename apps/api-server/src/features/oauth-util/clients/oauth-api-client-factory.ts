import { DiscordOauthApiClient } from "./discord-oauth-api-client";
import { GithubOauthApiClient } from "./github-oauth-api-client";
import { GoogleOauthApiClient } from "./google-oauth-api-client";
import { IOauthApiClient } from "./oauth-api-client";

export class OauthApiClientFactory {
  create(provider: string): IOauthApiClient {
    switch (provider.toLowerCase()) {
      case "google":
        return new GoogleOauthApiClient();
      case "github":
        return new GithubOauthApiClient();
      case "discord":
        return new DiscordOauthApiClient();
      default:
        throw new Error("Invalid OAuth Provider");
    }
  }
}
