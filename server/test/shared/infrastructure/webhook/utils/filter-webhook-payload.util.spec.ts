import {
  filterWebhookPayload,
  WebhookPayload,
} from "@/shared/infrastructure/webhook/utils/filter-webhook-payload.util";

describe("filterWebhookPayload", () => {
  const validPayload: WebhookPayload = {
    eventType: "todo.created",
    resourceId: "resource-123",
    timestamp: "2026-03-25T00:00:00.000Z",
    data: { title: "My Todo" },
  };

  describe("valid events", () => {
    it("should return filtered payload for todo.created event", () => {
      const result = filterWebhookPayload(validPayload);

      expect(result).not.toBeNull();
      expect(result!.eventType).toBe("todo.created");
      expect(result!.resourceId).toBe("resource-123");
      expect(result!.timestamp).toBe("2026-03-25T00:00:00.000Z");
      expect(result!.data).toEqual({ title: "My Todo" });
    });

    it("should return filtered payload for todo.updated event", () => {
      const payload: WebhookPayload = {
        ...validPayload,
        eventType: "todo.updated",
      };

      const result = filterWebhookPayload(payload);

      expect(result).not.toBeNull();
      expect(result!.eventType).toBe("todo.updated");
    });

    it("should return filtered payload for todo.deleted event", () => {
      const payload: WebhookPayload = {
        ...validPayload,
        eventType: "todo.deleted",
      };

      const result = filterWebhookPayload(payload);

      expect(result).not.toBeNull();
      expect(result!.eventType).toBe("todo.deleted");
    });
  });

  describe("unknown events", () => {
    it("should return null for unknown event type", () => {
      const payload: WebhookPayload = {
        ...validPayload,
        eventType: "unknown.event",
      };

      const result = filterWebhookPayload(payload);

      expect(result).toBeNull();
    });

    it("should return null for empty event type", () => {
      const payload: WebhookPayload = {
        ...validPayload,
        eventType: "",
      };

      const result = filterWebhookPayload(payload);

      expect(result).toBeNull();
    });
  });

  describe("missing required fields", () => {
    it("should return null when resourceId is missing", () => {
      const payload: WebhookPayload = {
        ...validPayload,
        resourceId: "",
      };

      const result = filterWebhookPayload(payload);

      expect(result).toBeNull();
    });

    it("should return null when timestamp is missing", () => {
      const payload: WebhookPayload = {
        ...validPayload,
        timestamp: "",
      };

      const result = filterWebhookPayload(payload);

      expect(result).toBeNull();
    });
  });
});
