import { Controller, Get } from "@nestjs/common";
import { AppService } from "@/app.service";
import { GetHelloMessageQuery } from "@/hello/query/get-hello-message.query";
import { HelloMessageResponseDto } from "@/hello/dto/hello-message.response.dto";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly getHelloMessageQuery: GetHelloMessageQuery,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("hello")
  getHelloMessage(): HelloMessageResponseDto {
    const helloMessage = this.getHelloMessageQuery.execute();
    return new HelloMessageResponseDto(helloMessage.value());
  }
}
