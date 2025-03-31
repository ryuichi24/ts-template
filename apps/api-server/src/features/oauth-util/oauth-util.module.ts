import { Module } from "@nestjs/common";
import { OAuthAgentFactory } from "./agents/oauth-agent-factory";
import { GoogleOauthApiClient } from "./clients/google-oauth-api-client";
import { OauthApiClientFactory } from "./clients/oauth-api-client-factory";
import { OAuthAccountManager } from "./managers/oauth-account.manager";
import { OAuthTokenManager } from "./managers/oauth-token.manager";

@Module({
  exports: [OAuthAgentFactory, OAuthAccountManager, OauthApiClientFactory, OAuthTokenManager, GoogleOauthApiClient],
  providers: [OAuthAgentFactory, OAuthAccountManager, OauthApiClientFactory, OAuthTokenManager, GoogleOauthApiClient],
})
export class OauthUtilModule {}
