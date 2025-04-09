import { Injectable } from '@nestjs/common';
import { Cache } from '@ts-template/cache';

@Injectable()
export class CacheService<TValue = any> extends Cache<TValue> {}
