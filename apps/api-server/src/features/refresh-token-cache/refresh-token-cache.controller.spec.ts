import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenCacheController } from './refresh-token-cache.controller';

describe('RefreshTokenCacheController', () => {
  let controller: RefreshTokenCacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenCacheController],
    }).compile();

    controller = module.get<RefreshTokenCacheController>(RefreshTokenCacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
