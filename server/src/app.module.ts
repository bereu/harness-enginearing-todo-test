import { Module } from "@nestjs/common";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { TodoModule } from "@/todos/todo.module";
import { SharedModule } from "@/shared/shared.module";

@Module({
  imports: [SharedModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
