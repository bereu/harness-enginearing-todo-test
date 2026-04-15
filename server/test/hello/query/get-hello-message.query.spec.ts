import { Test, TestingModule } from "@nestjs/testing";
import { GetHelloMessageQuery } from "@/hello/query/get-hello-message.query";
import { HelloMessage } from "@/hello/domain/hello-message";
import { HELLO_MESSAGE } from "@/hello/hello.constants";

describe("GetHelloMessageQuery", () => {
  let query: GetHelloMessageQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetHelloMessageQuery],
    }).compile();

    query = module.get<GetHelloMessageQuery>(GetHelloMessageQuery);
  });

  describe("execute", () => {
    it("should return a HelloMessage domain object", () => {
      const result = query.execute();
      expect(result).toBeInstanceOf(HelloMessage);
    });

    it("should return HelloMessage with the HELLO_MESSAGE constant value", () => {
      const result = query.execute();
      expect(result.value()).toBe(HELLO_MESSAGE);
    });

    it('should return HelloMessage with value "Hello World"', () => {
      const result = query.execute();
      expect(result.value()).toBe("Hello World");
    });
  });
});
