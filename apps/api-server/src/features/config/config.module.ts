import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { NodeJSCtx } from "@ts-template/node-js-ctx";
import { configFactory } from "./configuration";
import { ConfigService } from "./config.service";

// https://stackoverflow.com/a/77981827
@Global()
@Module({
  exports: [ConfigService],
  imports: [
    NestConfigModule.forRoot({
      // https://docs.nestjs.com/techniques/configuration#custom-env-file-path
      envFilePath: NodeJSCtx.isDev ? ".env.local" : undefined,
      // https://docs.nestjs.com/techniques/configuration#use-module-globally
      isGlobal: true,
      load: [configFactory],
    }),
  ],
  providers: [ConfigService],
})
export class ConfigModule {}
