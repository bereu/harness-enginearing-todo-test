# Agent Execution Plan: Add Hello Endpoint

## 1. Plan Overview

Add a GET `/hello` endpoint to the NestJS backend that returns `{"message": "Hello World"}`. This follows the existing layered architecture (BE-001) where the Controller handles the request via a Query class and returns a Response DTO.

## 2. Why It Is Needed

Provides a simple health-check or greeting endpoint to verify the server is running and responding correctly.

## 3. MagicNumber / Status design

```typescript
export const HELLO_MESSAGE = "Hello World" as const;
```

## 4. Action List

- [x] Create `HelloMessageResponseDto` in `server/src/hello/dto/hello-message.response.dto.ts`.
- [x] Create `GetHelloMessageQuery` in `server/src/hello/query/get-hello-message.query.ts` with `HELLO_MESSAGE` constant.
- [x] Create `HelloMessage` value domain in `server/src/hello/domain/hello-message.ts` (BE-002, BE-005).
- [x] Create `HelloModule` to encapsulate the feature providers.
- [x] Update `AppController` to inject `GetHelloMessageQuery` and add `@Get("hello")` endpoint returning `HelloMessageResponseDto`.
- [x] Import `HelloModule` in `AppModule`.
- [x] Revert `AppService` to original state (no hello logic there).
- [x] Add unit tests for domain, query, controller and e2e test.

## 5. AC (Acceptance Criteria)

- [x] `GET /hello` returns HTTP 200 with body `{"message": "Hello World"}`.
- [x] Existing endpoints are unaffected.
- [x] Lint passes with no errors.
