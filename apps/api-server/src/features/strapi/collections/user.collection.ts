import { HasUUID, StrapiBase } from "./strapi-base.collection";

export type UserCollection = StrapiBase &
  HasUUID & {
    username: string;
    email: string;
    passwordHash?: string;
    isEmailVerified: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    avatarUrl?: string;
  };
