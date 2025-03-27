import { CanActivate, ExecutionContext } from "@nestjs/common";

export class RoleGuard implements CanActivate {
  constructor(private _roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return !this._roles.includes(user.role);
  }
}
