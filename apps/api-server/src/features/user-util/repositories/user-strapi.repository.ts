import crypto from "crypto";
import { StrapiRepository } from "src/features/strapi/repositories/strapi.repository";
import { UserRepository } from "./user.repository";
import { StrapiClient } from "src/features/strapi/clients/strapi.client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserStrapiRepository extends StrapiRepository implements UserRepository {
  constructor(private _strapiClient: StrapiClient) {
    super();
  }

  async create(cmd: UserRepository.CreateCommand): Promise<UserRepository.User> {
    const res = await this._strapiClient
      .getCollection(StrapiClient.COLLECTIONS.USERS)
      .create({ ...cmd, uuid: crypto.randomUUID() });

    const { data: newUser, meta } = res;

    return this._normalizeStrapiCollection(newUser);
  }

  async getById(query: UserRepository.GetByIdQuery): Promise<UserRepository.User | null> {
    const res = await this._strapiClient
      .getCollection(StrapiClient.COLLECTIONS.USERS)
      .find({ filters: { uuid: query.id } });
    const { data: foundUsers, meta } = res;

    const foundUser = foundUsers[0];

    if (!foundUser) {
      return null;
    }
    return this._normalizeStrapiCollection(foundUser);
  }

  async getByEmail(query: UserRepository.GetByEmail): Promise<UserRepository.User | null> {
    const res = await this._strapiClient
      .getCollection(StrapiClient.COLLECTIONS.USERS)
      .find({ filters: { email: query.email } });
    const { data: foundUsers, meta } = res;

    const foundUser = foundUsers[0];

    if (!foundUser) {
      return null;
    }
    return this._normalizeStrapiCollection(foundUser);
  }

  async update(cmd: UserRepository.UpdateCommand): Promise<UserRepository.User | null> {
    throw new Error("Method not implemented.");
  }
}
