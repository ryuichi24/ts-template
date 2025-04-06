import { Module } from "@nestjs/common";
import { UserManager } from "./managers/user.manager";
import { StrapiModule } from "../strapi/strapi.module";

@Module({
  imports: [StrapiModule],
  exports: [UserManager],
  providers: [UserManager],
})
export class UserUtilModule {}
