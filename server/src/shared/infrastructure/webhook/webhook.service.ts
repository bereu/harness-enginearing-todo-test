import { Injectable } from "@nestjs/common";
import {
  FilteredWebhookPayload,
  WebhookPayload,
  filterWebhookPayload,
} from "@/shared/infrastructure/webhook/utils/filter-webhook-payload.util";

@Injectable()
export class WebhookService {
  processPayload(payload: WebhookPayload): FilteredWebhookPayload | null {
    return filterWebhookPayload(payload);
  }
}
