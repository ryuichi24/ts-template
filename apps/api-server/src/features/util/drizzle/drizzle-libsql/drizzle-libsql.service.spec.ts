import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleLibsqlService } from './drizzle-libsql.service';

describe('DrizzleLibsqlService', () => {
  let service: DrizzleLibsqlService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleLibsqlService<any>],
    }).compile();

    service = module.get<DrizzleLibsqlService<any>>(DrizzleLibsqlService<any>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
