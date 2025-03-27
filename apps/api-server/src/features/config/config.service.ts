import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { Config } from "./config.type";

@Injectable()
export class ConfigService extends NestConfigService<Config> {}
