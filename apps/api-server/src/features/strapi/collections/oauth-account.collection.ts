import { HasUUID, StrapiBase } from "./strapi-base.collection";

export type OAuthAccountCollection = StrapiBase &
  HasUUID & {
    userId: string;
    provider: string;
    oauthId: string;
  };
