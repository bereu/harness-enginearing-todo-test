export const WEBHOOK_EVENT_TYPES = [
  "todo.created",
  "todo.updated",
  "todo.deleted",
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];

export interface WebhookPayload {
  eventType: string;
  resourceId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface FilteredWebhookPayload {
  eventType: WebhookEventType;
  resourceId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export function isKnownWebhookEventType(
  eventType: string,
): eventType is WebhookEventType {
  return WEBHOOK_EVENT_TYPES.includes(eventType as WebhookEventType);
}

export function filterWebhookPayload(
  payload: WebhookPayload,
): FilteredWebhookPayload | null {
  if (!payload.eventType) {
    return null;
  }

  if (!payload.resourceId) {
    return null;
  }

  if (!payload.timestamp) {
    return null;
  }

  if (!isKnownWebhookEventType(payload.eventType)) {
    return null;
  }

  return {
    eventType: payload.eventType,
    resourceId: payload.resourceId,
    timestamp: payload.timestamp,
    data: payload.data,
  };
}
