import { Test, TestingModule } from "@nestjs/testing";
import { DrizzleMysql2Service } from "./drizzle-mysql2.service";

describe("DrizzleMysql2Service", () => {
  let service: DrizzleMysql2Service<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleMysql2Service],
    }).compile();

    service = module.get<DrizzleMysql2Service<any>>(DrizzleMysql2Service);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
