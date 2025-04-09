import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenCacheService } from './refresh-token-cache.service';

describe('RefreshTokenCacheService', () => {
  let service: RefreshTokenCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshTokenCacheService],
    }).compile();

    service = module.get<RefreshTokenCacheService>(RefreshTokenCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
