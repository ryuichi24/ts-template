export namespace UserRepository {
  export type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string | null;
    isEmailVerified: boolean;
    avatarUrl: string | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };

  export type CreateCommand = {
    username: string;
    email: string;
    passwordHash?: string;
    avatarUrl?: string;
    isEmailVerified?: boolean;
  };

  export type UpdateCommand = {
    id: string;
    data: Omit<Partial<User>, "id">;
  };

  export type GetByIdQuery = {
    id: string;
  };

  export type GetByEmail = {
    email: string;
  };
}

export interface UserRepository {
  create(cmd: UserRepository.CreateCommand): Promise<UserRepository.User>;
  getById(query: UserRepository.GetByIdQuery): Promise<UserRepository.User | null>;
  getByEmail(query: UserRepository.GetByEmail): Promise<UserRepository.User | null>;
  update(cmd: UserRepository.UpdateCommand): Promise<UserRepository.User | null>;
}

export const UserRepository = Symbol("UserRepository");
