---
name: BE-004 Compliance Refactoring - Test File Reorganization
description: Move test files from server/src to server/test per ADR requirement
type: execution_plan
created: 2026-03-18
adr: BE-004-test-for-bussiness-logic
---

# BE-004 Compliance Refactoring

## ADR Violation

**BE-004 Decision (Line 21)**:

> "We write test files to `server/test`."

**Current Violation**:
Test files are colocated in `server/src` instead of organized in `server/test`.

### Current Structure ❌

```
server/src/
├── app.controller.spec.ts
└── todos/
    ├── command/
    │   ├── create-todo.command.spec.ts
    │   └── update-todo.command.spec.ts
    └── query/
        ├── get-todo-by-id.query.spec.ts
        └── get-todos.query.spec.ts

server/test/
├── app.e2e-spec.ts
└── jest-e2e.json
```

### Target Structure ✅

```
server/src/
├── app.controller.ts
└── todos/
    ├── command/
    │   ├── create-todo.command.ts
    │   └── update-todo.command.ts
    └── query/
        ├── get-todo-by-id.query.ts
        └── get-todos.query.ts

server/test/
├── app.controller.spec.ts
├── app.e2e-spec.ts
├── jest-e2e.json
└── todos/
    ├── command/
    │   ├── create-todo.command.spec.ts
    │   └── update-todo.command.spec.ts
    └── query/
        ├── get-todo-by-id.query.spec.ts
        └── get-todos.query.spec.ts
```

---

## Tasks

### Task 1: Create Target Directory Structure

**Status**: Not Started

Create directories in `server/test/`:

```bash
mkdir -p server/test/todos/command
mkdir -p server/test/todos/query
```

**Deliverable**: Directory structure matches source structure

---

### Task 2: Move Test Files

**Status**: Not Started

Move all `.spec.ts` files from `server/src` to `server/test`:

1. **Controller test**:
   - From: `server/src/app.controller.spec.ts`
   - To: `server/test/app.controller.spec.ts`

2. **Command tests**:
   - From: `server/src/todos/command/create-todo.command.spec.ts`
   - To: `server/test/todos/command/create-todo.command.spec.ts`

   - From: `server/src/todos/command/update-todo.command.spec.ts`
   - To: `server/test/todos/command/update-todo.command.spec.ts`

3. **Query tests**:
   - From: `server/src/todos/query/get-todo-by-id.query.spec.ts`
   - To: `server/test/todos/query/get-todo-by-id.query.spec.ts`

   - From: `server/src/todos/query/get-todos.query.spec.ts`
   - To: `server/test/todos/query/get-todos.query.spec.ts`

**Deliverable**: All test files moved to server/test

---

### Task 3: Update Import Paths in Test Files

**Status**: Not Started

For each moved test file, update imports from source files.

**Example - Before**:

```typescript
import { CreateTodoCommand } from "./create-todo.command";
```

**Example - After**:

```typescript
import { CreateTodoCommand } from "@/todos/command/create-todo.command";
// or
import { CreateTodoCommand } from "../../../src/todos/command/create-todo.command";
```

Update all test files:

- `server/test/todos/command/create-todo.command.spec.ts`
- `server/test/todos/command/update-todo.command.spec.ts`
- `server/test/todos/query/get-todo-by-id.query.spec.ts`
- `server/test/todos/query/get-todos.query.spec.ts`
- `server/test/app.controller.spec.ts`

**Deliverable**: All imports reference correct source paths

---

### Task 4: Verify Test Configuration

**Status**: Not Started

Check if test runner (`vitest` or `jest`) is configured to:

1. Include tests in `server/test` directory
2. Still include e2e tests in `server/test`
3. Exclude tests from `server/src` directory

Files to check:

- `server/vitest.config.ts` or `server/jest.config.js`
- `server/package.json` (test scripts)
- `tsconfig.json` (path aliases like `@/`)

**Deliverable**: Test runner configured correctly

---

### Task 5: Run Tests

**Status**: Not Started

Verify all tests still work after reorganization:

```bash
cd server
npm run test
```

Expected:

- All tests pass
- Test coverage reports still generate
- No import errors
- Both unit and e2e tests run

**Deliverable**: All tests pass ✅

---

### Task 6: Cleanup

**Status**: Not Started

Remove any remaining `.spec.ts` files from `server/src`:

```bash
# Verify no .spec.ts files remain in src
find server/src -name "*.spec.ts" -type f
# Should return: (nothing)
```

**Deliverable**: No test files in server/src

---

## Dependencies

- `server/test/` directory structure must exist
- Path aliases (e.g., `@/`) must be configured in `tsconfig.json`
- Test runner must be configured for `server/test` directory

---

## Implementation Steps

1. Create target directory structure
2. Move all test files
3. Update import paths in each test file
4. Verify/update test configuration
5. Run full test suite
6. Verify no tests remain in src

---

## Verification Checklist

- [ ] No `.spec.ts` files in `server/src/`
- [ ] All `.spec.ts` files in `server/test/`
- [ ] Directory structure mirrors `server/src/` layout
- [ ] All imports in test files are correct
- [ ] Test configuration includes `server/test/`
- [ ] `npm run test` passes all tests
- [ ] Test coverage reports generate correctly
- [ ] No import errors in build/run

---

## Success Criteria

✅ BE-004 Compliance Achieved:

- Test files are in `server/test` directory
- Directory structure maintained (mirrors src)
- All tests pass with correct imports
- No test files remain in `server/src`

---

## ADR Reference

**BE-004-test-for-bussiness-logic**

- **Decision**: "We write test files to `server/test`."
- **Layers tested**: Coordinator, Query, Command
- **Coverage target**: >80% on business logic layers
- **Don't mock**: Bottom layer (Repository/DataSource)

---

## Related Files

- `.archgate/adrs/BE-004-test-for-bussiness-logic.md` (ADR definition)
- `server/package.json` (test scripts)
- `server/vitest.config.ts` or `server/jest.config.js` (test config)
- `tsconfig.json` (path aliases)
