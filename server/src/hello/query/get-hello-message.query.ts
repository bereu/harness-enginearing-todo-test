import { Injectable } from "@nestjs/common";
import { HelloMessage } from "@/hello/domain/hello-message";
import { HELLO_MESSAGE } from "@/hello/hello.constants";

@Injectable()
export class GetHelloMessageQuery {
  execute(): HelloMessage {
    return HelloMessage.create(HELLO_MESSAGE);
  }
}
