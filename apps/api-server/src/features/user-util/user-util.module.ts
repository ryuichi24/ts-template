import { Module } from "@nestjs/common";
import { StrapiModule } from "../strapi/strapi.module";
import { UserRepository } from "./repositories/user.repository";
import { UserStrapiRepository } from "./repositories/user-strapi.repository";

@Module({
  imports: [StrapiModule],
  exports: [UserRepository],
  providers: [
    {
      provide: UserRepository,
      useClass: UserStrapiRepository,
    },
  ],
})
export class UserUtilModule {}
