import { Module } from "@nestjs/common";
import { RollbarService } from "@/shared/infrastructure/rollbar/rollbar.service";

@Module({
  providers: [RollbarService],
  exports: [RollbarService],
})
export class SharedModule {}
