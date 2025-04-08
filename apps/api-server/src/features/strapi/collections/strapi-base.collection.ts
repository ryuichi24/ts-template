export type StrapiBase = {
  id: string;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
};

export type HasUUID = {
  uuid: string;
};

export type StrapiBaseWithUUID = StrapiBase & HasUUID;
