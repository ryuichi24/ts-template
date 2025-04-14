import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleBetterSqlite3Service } from './drizzle-better-sqlite3.service';

describe('DrizzleBetterSqlite3Service', () => {
  let service: DrizzleBetterSqlite3Service<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleBetterSqlite3Service],
    }).compile();

    service = module.get<DrizzleBetterSqlite3Service<any>>(DrizzleBetterSqlite3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
