import crypto from "crypto";
import { Injectable, Scope } from "@nestjs/common";
import { StrapiClient } from "src/features/strapi/clients/strapi.client";
import { CreateUserDto, IUserManager, UpdateUserDto, User } from "./user-base.manager";
import { StrapiBaseWithUUID } from "src/features/strapi/collections/strapi-base.collection";

@Injectable({ scope: Scope.DEFAULT })
export class UserManager implements IUserManager {
  constructor(private _strapiClient: StrapiClient) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const res = await this._strapiClient.getCollection(StrapiClient.COLLECTIONS.USERS).create({
      uuid: crypto.randomUUID(),
      username: createUserDto.username,
      email: createUserDto.email,
      isEmailVerified: createUserDto.isEmailVerified,
      avatarUrl: createUserDto.avatarUrl,
      passwordHash: createUserDto.passwordHash,
    });

    const { data: newUser, meta } = res;

    return this._normalizeStrapiCollection(newUser);
  }

  updateUser(dto: UpdateUserDto): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public async getUserById(id: string) {
    const res = await this._strapiClient.getCollection(StrapiClient.COLLECTIONS.USERS).find({ filters: { uuid: id } });
    const { data: foundUsers, meta } = res;

    const foundUser = foundUsers[0];

    if (!foundUser) {
      return null;
    }
    return this._normalizeStrapiCollection(foundUser);
  }

  public async getUserByEmail(email: string) {
    const res = await this._strapiClient.getCollection(StrapiClient.COLLECTIONS.USERS).find({ filters: { email } });
    const { data: foundUsers, meta } = res;

    const foundUser = foundUsers[0];

    if (!foundUser) {
      return null;
    }
    return this._normalizeStrapiCollection(foundUser);
  }

  private _normalizeStrapiCollection<TCollection extends StrapiBaseWithUUID>(strapiCollection: TCollection): User {
    const { id, documentId, uuid, publishedAt, ...rest } = strapiCollection;
    return { id: uuid, ...rest } as unknown as User;
  }
}
