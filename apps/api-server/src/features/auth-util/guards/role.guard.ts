import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Roles.Key[]>(Roles, [context.getHandler(), context.getClass()]);
    if (!roles) {
      throw new UnauthorizedException("Invalid token Token.");
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Invalid token Token.");
    }

    if (!user.roles) {
      throw new UnauthorizedException("Invalid token Token.");
    }

    const hasRole = () => user.roles.some((role: string) => !!roles.find((item) => item === role));

    return hasRole();
  }
}
