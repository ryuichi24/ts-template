import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleNodePostgresService } from './drizzle-node-postgres.service';

describe('DrizzleNodePostgresService', () => {
  let service: DrizzleNodePostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleNodePostgresService],
    }).compile();

    service = module.get<DrizzleNodePostgresService>(DrizzleNodePostgresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
