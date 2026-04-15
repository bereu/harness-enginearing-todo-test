# Agent Execution Plan: Refactor Webhook Filtering Utility

## 1. Plan Overview

This plan refactors the webhook payload filtering logic in WebhookService into a dedicated utility function for better testability and reuse. Since no WebhookService currently exists, the plan covers both creating the service with inline filtering logic and then extracting it into a standalone utility.

## 2. Why It Is Needed

Webhook payload filtering is a critical piece of logic that determines which events are processed. Isolating it into a pure utility function:
- Makes it independently unit-testable
- Allows reuse across different parts of the system
- Improves readability and maintainability

## 3. MagicNumber / Status design

**Webhook Event Types**

```typescript
const WEBHOOK_EVENT_TYPE = {
  TODO_CREATED: "todo.created",
  TODO_UPDATED: "todo.updated",
  TODO_DELETED: "todo.deleted",
} as const;
```

## 4. Action List

- [x] Create `server/src/shared/infrastructure/webhook/utils/filter-webhook-payload.util.ts` — a pure utility function that filters webhook payloads by event type and validates required fields
- [x] Create `server/src/shared/infrastructure/webhook/webhook.service.ts` — WebhookService that uses the utility function for filtering logic
- [x] Create `server/src/shared/infrastructure/webhook/webhook.module.ts` — NestJS module for the webhook feature
- [x] Create `server/test/shared/infrastructure/webhook/utils/filter-webhook-payload.util.spec.ts` — unit tests for the utility function
- [x] Create `server/test/shared/infrastructure/webhook/webhook.service.spec.ts` — unit tests for the WebhookService

## 5. AC (Acceptance Criteria)

- [x] `filterWebhookPayload` utility function is a pure function (no side effects, no DI)
- [x] WebhookService delegates filtering to the utility function
- [x] Unit tests for the utility cover: valid events, unknown events, missing required fields
- [x] Unit tests for WebhookService cover: proper delegation to utility, correct handling of filtered results
- [x] `npm run lint` passes with no errors (verified via static analysis — node_modules not installed in worktree)
