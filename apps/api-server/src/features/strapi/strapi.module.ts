import { Module } from "@nestjs/common";
import { StrapiService } from "./strapi.service";
import { StrapiClient } from "./clients/strapi.client";

@Module({
  exports: [StrapiClient],
  providers: [StrapiService, StrapiClient],
})
export class StrapiModule {}
