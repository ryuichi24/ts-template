import { Injectable } from "@nestjs/common";
import { strapi, Strapi } from "@strapi/client";
import { ConfigService } from "src/features/config/config.service";

const client = strapi({ baseURL: "http://localhost:1337/api" });

type StrapiCollection = "user" | "oauth-account";
type StrapiSingle = "";

@Injectable()
export class StrapiClient {
  private _client: Strapi;
  constructor(private _configService: ConfigService) {
    const baseURL = this._configService.getOrThrow("api.strapi.baseUrl", { infer: true });
    const token = this._configService.getOrThrow("api.strapi.token", { infer: true });

    this._client = strapi({
      baseURL,
      auth: token,
    });
  }

  public getCollection(type: StrapiCollection) {
    return this._client.collection(type);
  }

  public getSingle(type: StrapiSingle) {
    return this._client.single(type);
  }
}
