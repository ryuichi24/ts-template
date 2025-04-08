export type User = {
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

export type CreateUserDto = {
  username: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  isEmailVerified?: boolean;
};

export type UpdateUserDto = {
  id: string;
  data: Omit<Partial<User>, "id">;
};

export interface IUserManager {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(dto: UpdateUserDto): Promise<User>;
}
