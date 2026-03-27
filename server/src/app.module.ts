import { Module } from "@nestjs/common";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { TodoModule } from "@/todos/todo.module";
import { SharedModule } from "@/shared/shared.module";
import { StatusModule } from "@/statuses/status.module";
import { HelloModule } from "@/hello/hello.module";

@Module({
  imports: [SharedModule, TodoModule, StatusModule, HelloModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
