import { Module } from "@nestjs/common";
import { OAuthAgentFactory } from "./agents/oauth-agent-factory";
import { GoogleOauthApiClient } from "./clients/google-oauth-api-client";
import { OauthApiClientFactory } from "./clients/oauth-api-client-factory";
import { StrapiModule } from "../strapi/strapi.module";
import { OauthAccountStrapiRepository } from "./repositories/oauth-account-strapi.repository";
import { OauthAccountRepository } from "./repositories/oauth-account.repository";
import { OauthTokenRepository } from "./repositories/oauth-token.repository";
import { OauthTokenStrapiRepository } from "./repositories/oauth-token-cache.repository";
import { CacheModule } from "../util/cache/cache.module";
import { BetterSqlite3DbStore } from "../cache-util/stores/better-sqlite3-drizzle-db-store";
import { OauthTokenCache } from "./cache/oauth-token-cache";

@Module({
  imports: [
    StrapiModule,
    CacheModule.register({
      tag: OauthTokenCache,
      store: BetterSqlite3DbStore,
    }),
  ],
  exports: [
    // https://stackoverflow.com/questions/78405348/nest-cannot-export-a-provider-module
    OauthAccountRepository,
    OauthTokenRepository,
    OAuthAgentFactory,
    OauthApiClientFactory,
    GoogleOauthApiClient,
  ],
  providers: [
    OAuthAgentFactory,
    OauthApiClientFactory,
    GoogleOauthApiClient,
    // https://docs.nestjs.com/fundamentals/custom-providers#class-providers-useclass
    {
      provide: OauthAccountRepository,
      useClass: OauthAccountStrapiRepository,
    },
    {
      provide: OauthTokenRepository,
      useClass: OauthTokenStrapiRepository,
    },
  ],
})
export class OauthUtilModule {}
OauthAccountRepository;
