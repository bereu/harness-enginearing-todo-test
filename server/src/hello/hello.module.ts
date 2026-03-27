import { Module } from "@nestjs/common";
import { GetHelloMessageQuery } from "@/hello/query/get-hello-message.query";

@Module({
  providers: [GetHelloMessageQuery],
  exports: [GetHelloMessageQuery],
})
export class HelloModule {}
