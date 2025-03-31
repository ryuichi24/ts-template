import { Reflector } from "@nestjs/core";

export namespace Roles {
  export type Key = "admin" | "normal" | "test" | "customer_support";
}

// https://github.com/nestjs/nest/blob/6690ea23a7e3704b66225ad4dc8e00cd47711442/sample/01-cats-app/src/cats/cats.controller.ts#L15
export const Roles = Reflector.createDecorator<Roles.Key[]>();
