import { Inject, Injectable } from "@nestjs/common";
import { OauthAccountRepository } from "./oauth-account.repository";
import { NodePostgresDrizzleClientProvider } from "src/features/database/providers/node-postgres-drizzle-client-provider";
import { DrizzleNodePostgresService } from "src/features/util/drizzle/drizzle-node-postgres/drizzle-node-postgres.service";
import * as PgMainSchema from "../../database/drizzle-schema/node-postgres/index.js";
import { and, eq } from "drizzle-orm";

@Injectable()
export class OauthAccountInDbRepository implements OauthAccountRepository {
  constructor(
    @Inject(NodePostgresDrizzleClientProvider)
    private _drizzleClientProvider: DrizzleNodePostgresService<typeof PgMainSchema>,
  ) {}

  async create(cmd: OauthAccountRepository.CreateCommand): Promise<OauthAccountRepository.OAuthAccount> {
    const res = await this._drizzleClientProvider.drizzleClient
      .insert(PgMainSchema.oauthAccounts)
      .values({
        ...cmd,
      })
      .returning();

    const createdOauthAccount = res[0];
    return createdOauthAccount;
  }

  async getByUserIdAndProvider(
    query: OauthAccountRepository.GetByUserIdAndProviderQuery,
  ): Promise<OauthAccountRepository.OAuthAccount | null> {
    const res = await this._drizzleClientProvider.drizzleClient
      .select()
      .from(PgMainSchema.oauthAccounts)
      .where(
        and(
          eq(PgMainSchema.oauthAccounts.userId, query.userId),
          eq(PgMainSchema.oauthAccounts.provider, query.oauthProvider),
        ),
      )
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    const oauthAccount = res[0];
    return oauthAccount;
  }
  //
}
