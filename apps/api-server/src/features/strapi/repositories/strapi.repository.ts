import { StrapiBaseWithUUID } from "../collections/strapi-base.collection";

export abstract class StrapiRepository {
  protected _normalizeStrapiCollection<TCollection extends StrapiBaseWithUUID>(
    strapiCollection: TCollection,
  ): Omit<TCollection, "uuid"> & { id: string } {
    const { id, documentId, uuid, publishedAt, ...rest } = strapiCollection;
    return { id: uuid, ...rest } as Omit<TCollection, "uuid"> & { id: string };
  }
}
