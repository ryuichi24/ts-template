import { Module } from "@nestjs/common";
import { OAuthAgentFactory } from "./agents/oauth-agent-factory";
import { GoogleOauthApiClient } from "./clients/google-oauth-api-client";
import { OauthApiClientFactory } from "./clients/oauth-api-client-factory";
import { StrapiModule } from "../strapi/strapi.module";
import { StrapiClient } from "../strapi/clients/strapi.client";
import { OauthAccountStrapiRepository } from "./repositories/oauth-account-strapi.repository";
import { OauthAccountRepository } from "./repositories/oauth-account.repository";
import { OauthTokenRepository } from "./repositories/oauth-token.repository";
import { OauthTokenCacheRepository } from "./repositories/oauth-token-cache.repository";
import { CacheModule } from "../util/cache/cache.module";
import { OauthTokenCache } from "./cache/oauth-token-cache";
import { OauthAccountInMemoryRepository } from "./repositories/oauth-account-in-memory.repository";
import { BetterSqlite3DbStore } from "../cache-util/stores/better-sqlite3-drizzle-db-store";
import { NodePostgresDrizzleDbStore } from "../cache-util/stores/node-postgres-drizzle-db-store";
import { OauthAccountInDbRepository } from "./repositories/oauth-account-in-db.repository";

@Module({
  imports: [
    StrapiModule,
    CacheModule.register({
      tag: OauthTokenCache,
      // store: BetterSqlite3DbStore,
      store: NodePostgresDrizzleDbStore,
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
      useClass: OauthAccountInDbRepository,
    },
    // {
    //   provide: OauthAccountRepository,
    //   useFactory: async (strapiClient: StrapiClient) => {
    //     const isStrapiRunning = await strapiClient.isRunning();
    //     if (isStrapiRunning) {
    //       return new OauthAccountStrapiRepository(strapiClient);
    //     }
    //     // return new OauthAccountInMemoryRepository();
    //     return new OauthAccountInDbRepository();
    //   },
    //   inject: [StrapiClient],
    // },
    {
      provide: OauthTokenRepository,
      useClass: OauthTokenCacheRepository,
    },
  ],
})
export class OauthUtilModule {}
OauthAccountRepository;
