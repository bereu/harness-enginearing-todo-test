---
name: ADR Structural Violations Report
description: Comprehensive audit of architecture and structural rule violations
type: audit_report
created: 2026-03-18
---

# ADR Structural Violations Report

## Executive Summary

The codebase has **3 major structural violations** across two ADRs that must be fixed to achieve compliance:

| ADR    | Violation                               | Severity     | Files Affected |
| ------ | --------------------------------------- | ------------ | -------------- |
| BE-004 | Test files in `src/` instead of `test/` | 🔴 Critical  | 5 spec files   |
| BE-001 | Controller directly accesses Repository | 🔴 Critical  | 1 controller   |
| BE-002 | Domain classes follow rules correctly   | ✅ Compliant | N/A            |

---

## Violation 1: BE-004 - Test File Location

### Rule

> "We write test files to `server/test`." (Line 21)

### Violation ❌

Test files are colocated in `server/src` instead of organized in `server/test`.

### Current State

```
server/src/
├── app.controller.spec.ts                              ❌
├── todos/
│   ├── command/
│   │   ├── create-todo.command.spec.ts                 ❌
│   │   └── update-todo.command.spec.ts                 ❌
│   └── query/
│       ├── get-todo-by-id.query.spec.ts                ❌
│       └── get-todos.query.spec.ts                     ❌
```

### Required State

```
server/test/
├── app.controller.spec.ts                              ✅
├── app.e2e-spec.ts                                     ✅
├── jest-e2e.json
└── todos/
    ├── command/
    │   ├── create-todo.command.spec.ts                 ✅
    │   └── update-todo.command.spec.ts                 ✅
    └── query/
        ├── get-todo-by-id.query.spec.ts                ✅
        └── get-todos.query.spec.ts                     ✅
```

### Impact

- Tests are mixed with source code
- Violates explicit ADR requirement
- Makes source code directory harder to navigate
- Inconsistent with project conventions (E2E tests are already in `server/test`)

### Fix

Move 5 files from `server/src/` to `server/test/` maintaining directory structure.

**Task**: See `BE004_COMPLIANCE_REFACTOR.md`

---

## Violation 2: BE-001 - Controller Accessing Repository Directly

### Rule (Line 114-116)

> **Don't**: "Access the **DataSource** or **Repository** directly from the **Controller**."

### Violation ❌

Controller directly injects and uses `TodoRepository`:

**File**: `server/src/todos/todo.controller.ts`

```typescript
// Line 30: Direct injection of repository
private readonly todoRepository: TodoRepository

// Line 52: Direct repository access
@Get()
getTodos(@Query("status") status?: string): TodoResponseDto[] {
  if (status) {
    const todos = this.todoRepository.findByStatus(status);  // ❌ VIOLATION
    return todos.map((todo) => this.mapTodoToResponseDto(todo));
  }
  // ...
}
```

### Architecture Rule Violation

According to BE-001, the access hierarchy is:

```
Controller
├─> Coordinator (optional)
├─> Query (read-only)        ✅ Correct path
├─> Command (write)          ✅ Correct path
└─> Repository               ❌ NOT ALLOWED

Query/Command
└─> Repository/DataSource    ✅ Correct path
```

### Current Violation Flow ❌

```
Controller
    └─> Repository (direct access, violates BE-001)
```

### Required Flow ✅

```
Controller
    └─> Query
        └─> Repository
```

### Impact

- **Architectural Violation**: Breaks CQRS layer separation
- **Testability**: Repository not abstracted through Query layer
- **Reusability**: Business logic (filtering by status) is scattered
- **Consistency**: Other endpoints use Query/Command properly

### Files Involved

- **Controller**: `server/src/todos/todo.controller.ts` (Line 30, 52)
- **Query**: `server/src/todos/query/get-todos.query.ts` (missing `findByStatus` method)
- **Repository**: `server/src/todos/repository/todo.repository.ts` (line 67-81 has `findByStatus`)

### Current Repository Method ❌

```typescript
// server/src/todos/repository/todo.repository.ts (line 67-81)
findByStatus(status: string): Todo[] {
  const models = this.datasource.findAll();
  return models
    .filter((model) => model.status === status)
    .map((model) => Todo.reconstruct(...));
}
```

### Fix Required

#### Step 1: Create `GetTodosByStatusQuery`

**File**: `server/src/todos/query/get-todos-by-status.query.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { TodosList } from "@/todos/domain/todos-list";
import { TodoRepository } from "@/todos/repository/todo.repository";

@Injectable()
export class GetTodosByStatusQuery {
  constructor(private readonly repository: TodoRepository) {}

  execute(status: string): TodosList {
    const todos = this.repository.findByStatus(status);
    return TodosList.create(todos);
  }
}
```

#### Step 2: Update Controller ✅

**File**: `server/src/todos/todo.controller.ts`

```typescript
import { GetTodosByStatusQuery } from "@/todos/query/get-todos-by-status.query";

@Controller("todos")
export class TodoController {
  constructor(
    private readonly getTodosQuery: GetTodosQuery,
    private readonly getTodoByIdQuery: GetTodoByIdQuery,
    private readonly getTodosByStatusQuery: GetTodosByStatusQuery, // ✅ Add
    private readonly createTodoCommand: CreateTodoCommand,
    private readonly updateTodoCommand: UpdateTodoCommand,
    // Remove: private readonly todoRepository: TodoRepository,
  ) {}

  @Get()
  getTodos(@Query("status") status?: string): TodoResponseDto[] {
    if (status) {
      const todosList = this.getTodosByStatusQuery.execute(status); // ✅ Use query
      return todosList.getAll().map((todo) => this.mapTodoToResponseDto(todo));
    }
    const todosList = this.getTodosQuery.execute();
    return todosList.getAll().map((todo) => this.mapTodoToResponseDto(todo));
  }
  // ... rest of controller
}
```

#### Step 3: Update Module

**File**: `server/src/todos/todo.module.ts`

```typescript
import { GetTodosByStatusQuery } from "@/todos/query/get-todos-by-status.query";

@Module({
  providers: [
    TodoRepository,
    TodoDataSource,
    GetTodosQuery,
    GetTodoByIdQuery,
    GetTodosByStatusQuery, // ✅ Add
    CreateTodoCommand,
    UpdateTodoCommand,
  ],
  controllers: [TodoController],
})
export class TodoModule {}
```

#### Step 4: Create Tests

**File**: `server/test/todos/query/get-todos-by-status.query.spec.ts`

```typescript
describe("GetTodosByStatusQuery", () => {
  let query: GetTodosByStatusQuery;
  let repository: TodoRepository;

  beforeEach(() => {
    repository = new TodoRepository(/* mock datasource */);
    query = new GetTodosByStatusQuery(repository);
  });

  it("should return todos filtered by status", () => {
    const result = query.execute("done");
    expect(result.getAll()).toHaveLength(/* expected count */);
    expect(result.getAll().every((todo) => todo.status() === "done")).toBe(true);
  });

  it("should return empty list when no todos match status", () => {
    const result = query.execute("non-existent-status");
    expect(result.getAll()).toHaveLength(0);
  });
});
```

---

## Violation 3: BE-002 - Domain Classes Compliance

### Status: ✅ COMPLIANT

The domain classes properly follow BE-002 rules:

**TodoId** ✅

- Private constructor
- Private `_value` property with `.value()` getter
- Self-validation in static factory methods
- Immutable

**TodoTitle** ✅

- Private constructor
- Private `_value` property with `.value()` getter
- Self-validation with custom exceptions
- Immutable

**Todo** ✅

- Private constructor with all required fields
- Static factory methods (`.create()`, `.reconstruct()`)
- Public getter methods only
- Immutable derivation methods (`.withTitle()`, `.withStatus()`, etc.)
- Complete validation

**TodosList** ✅

- Wraps collection of domain objects
- Provides list-wide logic
- Immutable

**Custom Exceptions** ✅

- Domain-specific exceptions for validation
- Clear error messaging

---

## Summary of Required Fixes

| #   | ADR    | Violation             | Fix                  | Priority    | Files        |
| --- | ------ | --------------------- | -------------------- | ----------- | ------------ |
| 1   | BE-004 | Test files in `src/`  | Move to `test/`      | 🔴 Critical | 5 spec files |
| 2   | BE-001 | Controller→Repository | Create Query layer   | 🔴 Critical | 3 files      |
| 3   | BE-002 | Domain rules          | ✅ Already compliant | -           | -            |

---

## Implementation Order

### Wave 1: Fix BE-001 Architecture Violation

1. Create `GetTodosByStatusQuery` class
2. Update `TodoController` to use query instead of repository
3. Update `TodoModule` to provide new query
4. Create tests for new query
5. Verify all tests pass

### Wave 2: Fix BE-004 Test Structure Violation

1. Create `server/test/todos/` directory structure
2. Move all 5 `.spec.ts` files
3. Update import paths
4. Verify test configuration
5. Run full test suite

### Wave 3: Verification

1. Run `npm run test` - all tests pass
2. Run `npm run lint` - no violations
3. Verify no `.spec.ts` files remain in `src/`
4. Confirm all architecture rules followed

---

## Success Criteria

- ✅ No test files in `server/src/`
- ✅ All tests in `server/test/` with matching structure
- ✅ Controller only accesses Query/Command layers
- ✅ All 5 repository direct accesses removed from controller
- ✅ New `GetTodosByStatusQuery` created and tested
- ✅ `npm run test` passes all tests
- ✅ All ADR rules verified and compliant

---

## Related Documentation

- `.archgate/adrs/BE-001-layer-architecture-of-be.md` - Layer architecture rules
- `.archgate/adrs/BE-002-domain-class-rules.md` - Domain immutability rules
- `.archgate/adrs/BE-004-test-for-bussiness-logic.md` - Testing standards
- `docs/task/active/BE004_COMPLIANCE_REFACTOR.md` - Test file reorganization plan
