export type UserCollection = {
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
