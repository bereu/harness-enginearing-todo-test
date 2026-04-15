import { Test, TestingModule } from "@nestjs/testing";
import { WebhookService } from "@/shared/infrastructure/webhook/webhook.service";
import { WebhookPayload } from "@/shared/infrastructure/webhook/utils/filter-webhook-payload.util";

describe("WebhookService", () => {
  let service: WebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookService],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  describe("processPayload", () => {
    it("should delegate filtering to the utility and return filtered payload for valid event", () => {
      const payload: WebhookPayload = {
        eventType: "todo.created",
        resourceId: "resource-456",
        timestamp: "2026-03-25T00:00:00.000Z",
        data: { title: "Test Todo" },
      };

      const result = service.processPayload(payload);

      expect(result).not.toBeNull();
      expect(result!.eventType).toBe("todo.created");
      expect(result!.resourceId).toBe("resource-456");
    });

    it("should return null when the utility filters out an unknown event", () => {
      const payload: WebhookPayload = {
        eventType: "label.created",
        resourceId: "resource-789",
        timestamp: "2026-03-25T00:00:00.000Z",
        data: {},
      };

      const result = service.processPayload(payload);

      expect(result).toBeNull();
    });

    it("should return null when the utility filters out a payload with missing required fields", () => {
      const payload: WebhookPayload = {
        eventType: "todo.updated",
        resourceId: "",
        timestamp: "2026-03-25T00:00:00.000Z",
        data: {},
      };

      const result = service.processPayload(payload);

      expect(result).toBeNull();
    });
  });
});
