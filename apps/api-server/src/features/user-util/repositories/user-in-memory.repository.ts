import { StrapiRepository } from "src/features/strapi/repositories/strapi.repository";
import { UserRepository } from "./user.repository";

export class UserInMemoryRepository extends StrapiRepository implements UserRepository {
  private _users: UserRepository.User[];

  constructor() {
    super();
    this._users = [];
  }

  async create(cmd: UserRepository.CreateCommand): Promise<UserRepository.User> {
    const newUser = {
      ...cmd,
      id: crypto.randomUUID(),
      isEmailVerified: cmd.isEmailVerified ?? false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._users.push(newUser);

    return newUser as UserRepository.User;
  }

  async getById(query: UserRepository.GetByIdQuery): Promise<UserRepository.User | null> {
    // TODO: fetch user by email from the database or headless CMS
    const foundUser = this._users.find((user) => user.id === query.id);
    // TODO: if not found, return null
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }

  async getByEmail(query: UserRepository.GetByEmail): Promise<UserRepository.User | null> {
    // TODO: fetch user by email from the database or headless CMS
    const foundUser = this._users.find((user) => user.email === query.email);
    // TODO: if not found, return null
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }

  async update(cmd: UserRepository.UpdateCommand): Promise<UserRepository.User | null> {
    throw new Error("Method not implemented.");
  }
}
