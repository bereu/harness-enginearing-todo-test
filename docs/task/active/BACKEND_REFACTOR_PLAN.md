---
name: Backend Server Refactoring Plan
description: Complete server-side refactoring focusing on error handling (BE-003) and unit tests (BE-004)
type: execution_plan
created: 2026-03-18
target_phase: Phases 4 & 5
---

# Backend Server Refactoring Plan

## Overview

This plan consolidates the remaining backend refactoring work to achieve full ADR compliance. The backend has made significant progress but requires verification and completion of two critical areas:

1. **Phase 4 (BE-003)**: Error Handling & Monitoring with Rollbar
2. **Phase 5 (BE-004)**: Unit Tests for Business Logic

---

## Current Status

### ✅ Completed

- Error classes created: `BusinessLogicError`, `SystemError`
- Rollbar service initialized and configured
- Global exception filter wired in `main.ts`
- Command layer test files: `create-todo.command.spec.ts`, `update-todo.command.spec.ts`
- Query layer test files: `get-todos.query.spec.ts`, `get-todo-by-id.query.spec.ts`

### ⚠️ In Progress / Verification Needed

- **Exception filter integration**: Verify all exceptions are caught and properly categorized
- **Commands using error classes**: Check if commands throw appropriate error types
- **Test coverage**: Verify tests cover happy paths, edge cases, and error scenarios
- **Error context in logs**: Ensure errors include sufficient context (userId, resourceId, action)

---

## Phase 4: Backend Error Handling & Monitoring (BE-003)

### User Story

> Backend errors are categorized, logged, and reported to Rollbar with proper context

### Tasks

#### Task 4.1: Verify Exception Filter Integration

**Status**: Partially Complete

1. Review `all-exceptions.filter.ts`:
   - Confirm it catches all exceptions
   - Verify error distinction between `BusinessLogicError` and `SystemError`
   - Check that errors are properly sanitized before sending to Rollbar
   - Ensure appropriate HTTP status codes are returned

2. Verify integration in `main.ts`:
   - Filter is registered globally ✅
   - Filter receives RollbarService instance ✅

**Deliverable**: Exception filter properly handles all error types

---

#### Task 4.2: Update Commands & Queries to Use Error Classes

**Status**: Not Started

1. Audit `server/src/todos/command/`:
   - Check `create-todo.command.ts` - uses custom error classes for invalid title length
   - Check `update-todo.command.ts` - uses custom error classes for invalid status
   - Verify all business logic violations throw `BusinessLogicError`
   - Verify unexpected failures throw `SystemError`

2. Audit `server/src/todos/query/`:
   - Check `get-todos.query.ts` - handles empty results gracefully
   - Check `get-todo-by-id.query.ts` - throws `BusinessLogicError` for missing ID
   - Verify all queries throw appropriate error types

3. Update command/query implementations to use:
   ```typescript
   throw new BusinessLogicError("User message describing the business rule violation");
   throw new SystemError("System message for unexpected failures");
   ```

**Deliverable**: All commands and queries throw properly typed exceptions

---

#### Task 4.3: Verify Error Context in Rollbar Logs

**Status**: Not Started

1. Review `RollbarService`:
   - `logError()` - logs generic errors with context
   - `logBusinessLogicError()` - logs business rule violations
   - `logSystemError()` - logs unexpected system failures
   - All methods accept `ErrorContext` (userId, resourceId, action, etc.)

2. Update exception filter to provide context:
   - Extract userId from request (if available)
   - Include request method, URL, and parameters (non-sensitive)
   - Include error type and domain entity affected

3. Test error logging by simulating failures:
   - Create test that triggers `BusinessLogicError`
   - Verify Rollbar receives error with proper context

**Deliverable**: All errors logged to Rollbar with rich context

---

## Phase 5: Backend Unit Tests (BE-004)

### User Story

> Business logic in Query and Command layers is comprehensively tested with edge cases

### Tasks

#### Task 5.1: Verify Create Todo Command Tests

**Status**: Partially Complete

File: `server/src/todos/command/create-todo.command.spec.ts`

Test cases needed:

- ✅ Successful creation with title
- ✅ Successful creation with title and description
- ⚠️ Invalid title (empty string) throws error
- ⚠️ Invalid title (too long, >255 chars) throws error
- ⚠️ Verify domain object created with correct initial values
- ⚠️ Verify timestamps are set correctly

**Run**: `npm run test -- create-todo.command.spec.ts`

**Deliverable**: All test cases pass, >90% coverage

---

#### Task 5.2: Verify Update Todo Command Tests

**Status**: Partially Complete

File: `server/src/todos/command/update-todo.command.spec.ts`

Test cases needed:

- ✅ Successful update of title
- ✅ Successful update of description
- ✅ Successful update of status
- ⚠️ Update with invalid status throws error
- ⚠️ Update with title too long throws error
- ⚠️ Partial update (only some fields) works correctly
- ⚠️ Verify immutability - original object not modified
- ⚠️ Verify timestamps updated correctly

**Run**: `npm run test -- update-todo.command.spec.ts`

**Deliverable**: All test cases pass, >90% coverage

---

#### Task 5.3: Verify Get Todos Query Tests

**Status**: Partially Complete

File: `server/src/todos/query/get-todos.query.spec.ts`

Test cases needed:

- ✅ Successful retrieval of all todos
- ⚠️ Empty repository returns empty array
- ⚠️ Multiple todos returned in correct order
- ⚠️ Verify domain objects are properly constructed
- ⚠️ Test with filters (if applicable)

**Run**: `npm run test -- get-todos.query.spec.ts`

**Deliverable**: All test cases pass, >85% coverage

---

#### Task 5.4: Verify Get Todo By ID Query Tests

**Status**: Partially Complete

File: `server/src/todos/query/get-todo-by-id.query.spec.ts`

Test cases needed:

- ✅ Successful retrieval by valid ID
- ⚠️ Non-existent ID throws error
- ⚠️ Invalid ID format throws error
- ⚠️ Verify domain object is properly constructed
- ⚠️ Verify correct todo is returned (not a different one)

**Run**: `npm run test -- get-todo-by-id.query.spec.ts`

**Deliverable**: All test cases pass, >90% coverage

---

#### Task 5.5: Verify Controller Tests

**Status**: Partially Complete

File: `server/src/app.controller.spec.ts`

Test cases needed:

- ✅ GET /todos returns all todos
- ✅ GET /todos/:id returns specific todo
- ✅ POST /todos creates new todo
- ✅ PATCH /todos/:id updates todo
- ⚠️ All error cases return proper HTTP status codes
- ⚠️ Integration between controller, commands, and queries

**Run**: `npm run test -- app.controller.spec.ts`

**Deliverable**: All test cases pass, >85% coverage

---

## Implementation Order

### Step 1: Verify Phase 4 (BE-003) Completion

1. Review exception filter implementation
2. Audit all commands/queries for error class usage
3. Test error logging to Rollbar

**Estimated**: 2-3 hours

### Step 2: Verify Phase 5 (BE-004) Completion

1. Review and complete command test cases
2. Review and complete query test cases
3. Review and complete controller test cases
4. Run full test suite: `npm run test`

**Estimated**: 3-4 hours

### Step 3: Code Review & Compliance

1. Verify all ADR rules are followed
2. Check test coverage >= 80% on business logic
3. Run linter: `npm run lint`

**Estimated**: 1-2 hours

---

## Success Criteria

- ✅ Exception filter catches all exceptions
- ✅ Commands/queries throw appropriate error types
- ✅ All errors logged to Rollbar with context
- ✅ All command tests pass (>90% coverage)
- ✅ All query tests pass (>85% coverage)
- ✅ Controller tests verify integration
- ✅ Overall test coverage >80% for business logic
- ✅ No `fetch` statements in service layer
- ✅ All tests pass: `npm run test`
- ✅ All linting passes: `npm run lint`

---

## ADR Compliance Checklist

### BE-001: Layer Architecture

- [ ] Controller → DTO mapping exists
- [ ] Coordinator used only for orchestration (not single-layer wrapping)
- [ ] Query layer is read-only
- [ ] Command layer is write-only
- [ ] No direct DataSource access from Controller

### BE-002: Domain Class Rules

- [ ] Domain classes are immutable
- [ ] Domain classes include business validation
- [ ] Domain objects used in Commands/Queries

### BE-003: Error Handling with Rollbar

- [ ] `BusinessLogicError` used for validation failures
- [ ] `SystemError` used for unexpected failures
- [ ] Exception filter categorizes and logs all errors
- [ ] Error context includes userId, resourceId, action
- [ ] No sensitive data in error logs

### BE-004: Tests for Business Logic

- [ ] Unit tests for Query layer
- [ ] Unit tests for Command layer
- [ ] Test coverage >80% for business logic layers
- [ ] Tests don't mock Repository layer
- [ ] Tests use descriptive names

---

## Testing Commands

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- create-todo.command.spec.ts

# Run tests with coverage
npm run test -- --coverage

# Watch mode for development
npm run test -- --watch
```

---

## Resources

- **ADR Files**: `docs/adr/BE-*.md`
- **Existing Plan**: `docs/task/active/REFACTOR_PLAN.md`
- **Server Source**: `server/src/`
- **Tests**: `server/src/**/*.spec.ts`

---

## Notes

- Previous waves (FE-001, FE-002, FE-003) have been implemented
- BE-001 and BE-002 compliance verified in earlier refactoring
- Focus now is on verification and completion of Phases 4 & 5
