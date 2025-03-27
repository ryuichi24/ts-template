import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";

@Injectable()
export class AuthService {
  constructor(private _configService: ConfigService) {}
}
