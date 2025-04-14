import { Test, TestingModule } from '@nestjs/testing';
import { DrizzlePostgresJsService } from './drizzle-postgres-js.service';

describe('DrizzlePostgresJsService', () => {
  let service: DrizzlePostgresJsService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzlePostgresJsService],
    }).compile();

    service = module.get<DrizzlePostgresJsService<any>>(DrizzlePostgresJsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
