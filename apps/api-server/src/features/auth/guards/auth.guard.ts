import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ConfigService } from "src/features/config/config.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _configService: ConfigService,
    private _jwtService: JwtService,
  ) {}

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid token Token.");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = this._jwtService.verify<{ email: string; oauthSessionId: string; iat: number; exp: number }>(
        token,
        {
          secret: this._configService.get("auth.jwt.accessToken.secret", { infer: true }),
        },
      );

      req.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token Token.");
    }
  }
}
