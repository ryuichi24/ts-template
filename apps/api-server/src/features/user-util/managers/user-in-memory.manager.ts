import crypto from "crypto";
import { Injectable, Scope } from "@nestjs/common";
import { IUserManager, UpdateUserDto, User } from "./user-base.manager";

@Injectable({ scope: Scope.DEFAULT })
export class UserManager implements IUserManager {
  private _users: User[];

  constructor() {
    this._users = [];
  }

  public async createUser(createUserDto: any): Promise<User> {
    const newUser = {
      id: crypto.randomUUID(),
      username: createUserDto.username,
      email: createUserDto.email,
      isEmailVerified: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._users.push(newUser);

    return newUser as User;
  }

  updateUser(dto: UpdateUserDto): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public async getUserById(id: string) {
    // TODO: fetch user by email from the database or headless CMS
    const foundUser = this._users.find((user) => user.id === id);
    // TODO: if not found, return null
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }

  public async getUserByEmail(email: string) {
    // TODO: fetch user by email from the database or headless CMS
    const foundUser = this._users.find((user) => user.email === email);
    // TODO: if not found, return null
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }
}
