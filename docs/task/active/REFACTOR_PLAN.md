---
name: ADR Compliance Refactor Plan
description: Refactor codebase to align with all established Architecture Decision Records
type: execution_plan
created: 2026-03-18
---

# ADR Compliance Refactor Plan

## Overview

This plan addresses violations of established Architecture Decision Records (ADRs) across both frontend and backend. The refactoring will be executed in waves to ensure stability and testability.

## ADR Violations Identified

### Frontend Violations

#### 1. **FE-002: Form Validation with Zod** ❌
- **Violation**: `TodoForm.tsx` uses manual validation instead of Zod schemas
- **Current State**: Lines 20-23 manually validate title with string checking
- **Required**: Define Zod schema for form validation
- **Impact**: Inconsistent validation patterns, poor UX with default HTML messages

#### 2. **FE-003: HTTP Client with Axios** ❌
- **Violation**: `todoService.ts` uses native `fetch` instead of Axios
- **Missing**:
  - Axios instance with global configuration
  - Request/response interceptors
  - Global error handling to Rollbar
  - Centralized base URL configuration
- **Impact**: No unified error handling, duplicated headers, manual error transformation

#### 3. **FE-001: Error Handling with Rollbar** ❌
- **Violation**: No Rollbar integration in frontend
- **Missing**:
  - Rollbar client initialization
  - Error boundary implementation
  - Global error capture for unhandled promises
  - Context-rich error logging
- **Impact**: No visibility into frontend errors, inability to monitor user issues

### Backend Violations

#### 4. **BE-004: Tests for Business Logic** ⚠️
- **Violation**: Missing unit tests for Query/Command layers
- **Current State**: Only `app.controller.spec.ts` exists
- **Required**: Unit tests for:
  - Query layer: `GetTodosQuery`, `GetTodoByIdQuery`
  - Command layer: `CreateTodoCommand`, `UpdateTodoCommand`
- **Impact**: No verification of business logic correctness

#### 5. **BE-003: Error Handling with Rollbar** ⚠️
- **Violation**: No Rollbar integration in backend
- **Missing**:
  - Custom error classes (BusinessLogicError, SystemError)
  - Rollbar configuration
  - Global exception filter for Rollbar reporting
  - Error property sanitization
- **Impact**: No centralized error monitoring

### Backend Compliance ✅
- **BE-001**: Layer architecture correctly followed (TodoCoordinator removed per commit 22d45a8)
- **BE-002**: Domain class immutability and self-validation correctly implemented

---

## Refactor Tasks

### Phase 1: Frontend Form Validation (FE-002)
**User Story**: User can see validated form errors using Zod

**Tasks**:
1. Create Zod schema file: `client/src/schemas/todo.schema.ts`
   - Define `CreateTodoSchema` with title validation (required, max 255 chars)
   - Define `UpdateTodoSchema` with optional fields
   - Export inferred types for TypeScript safety

2. Update `client/src/components/TodoForm.tsx`
   - Integrate Zod schema with form validation
   - Replace manual validation logic with Zod parsing
   - Display validation errors from Zod
   - Remove `novalidate` approach if using HTML5 validation

3. Test: Verify form rejects invalid inputs and shows appropriate error messages

---

### Phase 2: Frontend HTTP Client with Axios (FE-003)
**User Story**: Frontend uses Axios with centralized configuration and interceptors

**Tasks**:
1. Install Axios dependency (if not present)
   ```bash
   npm install axios
   ```

2. Create Axios instance: `client/src/services/httpClient.ts`
   - Set base URL from environment variable
   - Configure default headers
   - Configure timeout

3. Create Axios interceptors: `client/src/services/interceptors/`
   - Request interceptor: inject headers, auth tokens
   - Response interceptor: handle 401, 5xx errors, send to Rollbar
   - Error interceptor: transform errors consistently

4. Update `client/src/services/todoService.ts`
   - Replace all `fetch` calls with Axios instance
   - Remove manual error handling
   - Simplify error transformation

5. Test: Verify all API calls use Axios and interceptors execute

---

### Phase 3: Frontend Error Handling & Monitoring (FE-001)
**User Story**: Frontend errors are captured and reported to Rollbar

**Tasks**:
1. Install Rollbar: `npm install rollbar`

2. Initialize Rollbar: `client/src/services/rollbar.ts`
   - Configure with API token (from env)
   - Set up globally

3. Create Error Boundary: `client/src/components/ErrorBoundary.tsx`
   - Catch React component errors
   - Log to Rollbar with component context
   - Display fallback UI

4. Add global unhandled promise rejection handler: `client/src/main.tsx`
   - Listen to `unhandledrejection`
   - Send to Rollbar with context

5. Update `client/src/services/interceptors/` (from Phase 2)
   - Send API errors to Rollbar with request context (method, URL, params)
   - Avoid sending sensitive data

6. Test: Verify errors are captured and appear in Rollbar

---

### Phase 4: Backend Error Handling & Monitoring (BE-003)
**User Story**: Backend errors are categorized and reported to Rollbar

**Tasks**:
1. Install Rollbar: `npm install rollbar`

2. Create error classes: `server/src/shared/domain/errors/`
   - `BusinessLogicError` (4xx-friendly errors)
   - `SystemError` (unexpected failures)
   - Custom error for domain violations

3. Create Rollbar config: `server/src/shared/infrastructure/rollbar/`
   - Initialize Rollbar service
   - Export Rollbar singleton

4. Create Global Exception Filter: `server/src/shared/infrastructure/filters/all-exceptions.filter.ts`
   - Catch all exceptions
   - Distinguish business vs system errors
   - Send to Rollbar with sanitized properties
   - Return appropriate HTTP status codes

5. Update controllers and commands to use custom error classes
   - Replace generic exceptions
   - Ensure errors include context (user ID, resource ID, etc.)

6. Test: Verify errors are caught and reported to Rollbar

---

### Phase 5: Backend Unit Tests (BE-004)
**User Story**: Business logic in Query and Command layers is tested

**Tasks**:
1. Create test file: `server/src/todos/query/get-todos.query.spec.ts`
   - Test successful retrieval
   - Test with empty repository
   - Verify domain object construction

2. Create test file: `server/src/todos/query/get-todo-by-id.query.spec.ts`
   - Test successful retrieval
   - Test non-existent ID throws error
   - Test business logic validation

3. Create test file: `server/src/todos/command/create-todo.command.spec.ts`
   - Test successful creation with title
   - Test with invalid title (too long, empty)
   - Verify domain object created correctly
   - Test with optional description

4. Create test file: `server/src/todos/command/update-todo.command.spec.ts`
   - Test successful updates (title, description, status)
   - Test invalid status throws error
   - Test partial updates
   - Verify immutability (original not modified)

5. Verify all tests pass

---

## Implementation Order

**Wave 1 (Frontend Form & HTTP)**:
- Phase 1: Form Validation with Zod
- Phase 2: Axios HTTP Client

**Wave 2 (Error Handling)**:
- Phase 3: Frontend Rollbar
- Phase 4: Backend Rollbar

**Wave 3 (Testing)**:
- Phase 5: Backend Unit Tests

---

## Success Criteria

- ✅ All forms use Zod schemas
- ✅ All frontend API calls use Axios with interceptors
- ✅ All frontend errors (unhandled exceptions, API errors, validation) are sent to Rollbar
- ✅ All backend errors are categorized and sent to Rollbar with context
- ✅ Query and Command layers have comprehensive unit tests
- ✅ No `fetch` calls in frontend code (except in service layer using Axios)
- ✅ No manual error handling in todoService.ts
- ✅ All tests pass with >80% coverage on business logic layers

---

## Dependencies

- **Zod** (already installed v4.3.6)
- **Axios** (needs installation)
- **Rollbar** (needs installation for both frontend and backend)
- **React Error Boundary** (built-in React feature)
- **Vitest/Jest** (likely already configured for testing)

---

## Notes

- Previous refactoring removed TodoCoordinator (commit 22d45a8) - BE-001 compliant
- Domain classes (BE-002) are already correctly implemented with immutability and self-validation
- New ADR files (FE-001, FE-002, FE-003) are not yet integrated into codebase
