import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { GetHelloMessageQuery } from "@/hello/query/get-hello-message.query";
import { HelloMessageResponseDto } from "@/hello/dto/hello-message.response.dto";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, GetHelloMessageQuery],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello from NestJS Backend!"', () => {
      expect(appController.getHello()).toBe("Hello from NestJS Backend!");
    });
  });

  describe("GET /hello", () => {
    it('should return a HelloMessageResponseDto with message "Hello World"', () => {
      const result = appController.getHelloMessage();
      expect(result).toBeInstanceOf(HelloMessageResponseDto);
      expect(result.message).toBe("Hello World");
    });
  });
});
