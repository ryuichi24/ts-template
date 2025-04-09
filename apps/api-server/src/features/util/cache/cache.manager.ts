import { Injectable, Scope } from "@nestjs/common";
import { Cache } from "@ts-template/cache";

@Injectable({ scope: Scope.DEFAULT })
export class CacheManager extends Cache<any> {}
