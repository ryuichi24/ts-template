import { Injectable, Scope } from "@nestjs/common";

type User = {
  id: string;
  username: string;
  email: string;
  password_hash?: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
};

type EmailVerificationToken = {};

@Injectable({ scope: Scope.DEFAULT })
export class UserManager {
  private _users: User[];

  constructor() {
    this._users = [];
  }

  public async createUser(createUserDto: any): Promise<User> {
    const newUser = {
      id: (this._users.length + 1).toString(),
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

  public async getUser() {}

  public async updateUser() {}

  public async deleteUser() {}

  public async listUsers() {
    return this._users;
  }

  public async searchUsers() {}

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

  public async getUserByUsername() {}
}
