import { Module } from "@nestjs/common";
import { WebhookService } from "@/shared/infrastructure/webhook/webhook.service";

@Module({
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
