export namespace OauthTokenRepository {
  export type OauthToken = {
    id: string;
    oauthId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
  };

  export type CreateCommand = { oauthId: string; accessToken: string; refreshToken: string; expiresIn: number };

  export type GetBuOauthIdQuery = {
    oauthId: string;
  };

  export type UpdateCommand = { oauthId: string; accessToken: string; refreshToken: string; expiresAt: Date };

  export type DeleteCommand = { oauthId: string };
}

export interface OauthTokenRepository {
  create(cmd: OauthTokenRepository.CreateCommand): Promise<OauthTokenRepository.OauthToken>;
  getByOauthId(query: OauthTokenRepository.GetBuOauthIdQuery): Promise<OauthTokenRepository.OauthToken | null>;
  update(cmd: OauthTokenRepository.UpdateCommand): Promise<OauthTokenRepository.OauthToken | null>;
  delete(cmd: OauthTokenRepository.DeleteCommand): Promise<void>;
}

export const OauthTokenRepository = Symbol("OauthTokenRepository");
