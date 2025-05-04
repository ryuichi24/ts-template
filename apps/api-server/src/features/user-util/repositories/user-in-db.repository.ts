import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { NodePostgresDrizzleClientProvider } from "src/features/database/providers/node-postgres-drizzle-client-provider";
import { DrizzleNodePostgresService } from "src/features/util/drizzle/drizzle-node-postgres/drizzle-node-postgres.service";
import * as PgMainSchema from "../../database/drizzle-schema/node-postgres/index.js";
import { eq } from "drizzle-orm";

@Injectable()
export class UserInDbRepository implements UserRepository {
  constructor(
    @Inject(NodePostgresDrizzleClientProvider)
    private _drizzleClientProvider: DrizzleNodePostgresService<typeof PgMainSchema>,
  ) {}

  async create(cmd: UserRepository.CreateCommand): Promise<UserRepository.User> {
    const res = await this._drizzleClientProvider.drizzleClient
      .insert(PgMainSchema.users)
      .values({
        ...cmd,
      })
      .returning();

    const createdUser = res[0];
    return createdUser;
  }

  async getById(query: UserRepository.GetByIdQuery): Promise<UserRepository.User | null> {
    const res = await this._drizzleClientProvider.drizzleClient
      .select()
      .from(PgMainSchema.users)
      .where(eq(PgMainSchema.users.id, query.id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    const user = res[0];
    return user;
  }

  async getByEmail(query: UserRepository.GetByEmail): Promise<UserRepository.User | null> {
    const res = await this._drizzleClientProvider.drizzleClient
      .select()
      .from(PgMainSchema.users)
      .where(eq(PgMainSchema.users.email, query.email))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    const user = res[0];
    return user;
  }

  async update(cmd: UserRepository.UpdateCommand): Promise<UserRepository.User | null> {
    const res = await this._drizzleClientProvider.drizzleClient
      .update(PgMainSchema.users)
      .set({
        ...cmd.data,
      })
      .where(eq(PgMainSchema.users.id, cmd.id))
      .returning();

    if (res.length === 0) {
      return null;
    }

    const updatedUser = res[0];
    return updatedUser;
  }
}
