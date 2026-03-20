---
id: STATUS-INLINE-001
title: User can create new status inline from todo forms
user_story: User can create a new custom status directly from the create or edit todo form without navigating away
status: active
created_date: 2026-03-19
---

# User Can Create New Status Inline

## Overview

Allow users to create custom todo statuses inline from both the Create Todo form and the Edit Todo modal. Currently, statuses are hardcoded to `"todo"`, `"in-progress"`, and `"done"`. This feature introduces a dynamic status registry on the backend and an inline "Add status" UI on the frontend.

## User Story

**As a user**, I want to type a new status name directly in the status field of the create or edit todo form so that I can organize todos with custom workflow states without leaving the form.

### Acceptance Criteria

1. **Status dropdown shows all available statuses** (built-in + user-created)
2. **"Add new status" option appears** at the bottom of the status dropdown
3. **User can type a new status name** in an inline input when "Add new status" is selected
4. **Pressing Enter or clicking Confirm** saves the new status and selects it
5. **New status is persisted on the backend** via `POST /statuses`
6. **New status appears in future dropdowns** (fetched from `GET /statuses`)
7. **Status label validation**: non-empty, max 50 characters
8. **Works in both create todo form and edit todo form**

## ADRs to Follow

- **GEN-001**: Status values must NOT use magic strings in business logic; use named constants/types
- **FE-002**: Zod schema for status validation (update to accept any valid string)
- **FE-003**: Use configured Axios instance for status API calls
- **BE-002**: Status domain must be immutable, self-validating, getter-only
- **BE-006**: StatusList domain for managing collections

## Architecture Overview

### Backend: New Status Resource

New in-memory status registry following the same architecture pattern as todos.

```
server/src/statuses/
├── domain/
│   ├── status.ts               (CREATE - Status domain: id, label, slug)
│   └── statuses-list.ts        (CREATE - StatusList domain)
├── datasource/
│   └── status.datasource.ts    (CREATE - in-memory store, pre-seeded)
├── repository/
│   └── status.repository.ts    (CREATE - maps datasource ↔ domain)
├── dto/
│   ├── create-status.dto.ts    (CREATE - validation DTO)
│   └── status.response.dto.ts  (CREATE - response shape)
├── command/
│   └── create-status.command.ts (CREATE - business logic)
├── query/
│   └── get-statuses.query.ts   (CREATE - list all statuses)
├── status.controller.ts        (CREATE - GET /statuses, POST /statuses)
└── status.module.ts            (CREATE - NestJS module)
```

#### Status Domain Model

```typescript
// Status domain: id (UUID), label (display), slug (used as todo.status value)
// e.g.: { id: "uuid", label: "In Review", slug: "in-review" }
// Built-in statuses are pre-seeded into the datasource on startup
```

#### Backend: Todo Domain Update

- Remove `@IsIn(VALID_STATUSES)` from `CreateTodoDto` and `UpdateTodoDto`
- Add `@MaxLength(50)` and `@IsNotEmpty()` for status in DTOs instead
- Update `Todo.validateStatus()` to validate non-empty string (remove VALID_STATUSES dependency)
- Keep `VALID_STATUSES` constant for the pre-seeded default statuses only
- Update `app.module.ts` to import `StatusModule`

### Frontend: Dynamic Status UI

```
client/src/
├── services/
│   └── status-service.ts        (CREATE - getStatuses(), createStatus(label))
├── hooks/
│   └── use-statuses.ts          (CREATE - fetch + cache statuses)
├── components/
│   ├── todo-form.tsx            (MODIFY - add status field + inline create)
│   └── edit-todo-form.tsx       (MODIFY - add inline create to existing status select)
├── types/
│   └── todo.ts                  (MODIFY - TodoStatus: string instead of union)
├── constants/
│   └── todo-statuses.ts         (MODIFY - remove static STATUS_COLORS/LABELS deps on union)
└── schemas/
    └── todo.schema.ts           (MODIFY - status: z.string().min(1).max(50))
```

## Implementation Plan

### Phase 1: Backend - Status Domain & API

**Action 1.1**: Create `Status` domain at `server/src/statuses/domain/status.ts`

- Private constructor, getters only (BE-002)
- Fields: `_id: string`, `_label: string`, `_slug: string`
- `static create(label: string): Status` — generates slug from label (lowercase, hyphen)
- `static reconstruct(id, label, slug): Status`
- Validates: label non-empty, max 50 chars; slug non-empty, max 50 chars

**Action 1.2**: Create `StatusList` domain at `server/src/statuses/domain/statuses-list.ts`

- Follows BE-006 pattern
- Methods: `getAll()`, `findBySlug(slug)`, `add(status)`, `slugExists(slug)`

**Action 1.3**: Create `StatusDataSource` at `server/src/statuses/datasource/status.datasource.ts`

- In-memory store (same pattern as `TodoDataSource`)
- Pre-seeded with built-in statuses: `todo`, `in-progress`, `done`

**Action 1.4**: Create `StatusRepository` at `server/src/statuses/repository/status.repository.ts`

- `findAll(): StatusList`
- `save(status: Status): void`
- `findBySlug(slug: string): Status | null`

**Action 1.5**: Create DTOs

- `create-status.dto.ts`: `@IsString @IsNotEmpty @MaxLength(50) label: string`
- `status.response.dto.ts`: `{ id, label, slug }`

**Action 1.6**: Create `GetStatusesQuery` at `server/src/statuses/query/get-statuses.query.ts`

- Returns all statuses from repository as `StatusResponseDto[]`

**Action 1.7**: Create `CreateStatusCommand` at `server/src/statuses/command/create-status.command.ts`

- Generates slug from label
- Checks slug uniqueness; throws `BusinessLogicError` if duplicate
- Saves to repository

**Action 1.8**: Create `StatusController` at `server/src/statuses/status.controller.ts`

- `GET /statuses` → `GetStatusesQuery.execute()`
- `POST /statuses` → `CreateStatusCommand.execute(dto)`

**Action 1.9**: Create `StatusModule` at `server/src/statuses/status.module.ts`

- Provides: `StatusDataSource`, `StatusRepository`, `GetStatusesQuery`, `CreateStatusCommand`
- Controller: `StatusController`

**Action 1.10**: Register `StatusModule` in `server/src/app.module.ts`

**Action 1.11**: Update `CreateTodoDto` and `UpdateTodoDto`

- Remove `@IsIn(VALID_STATUSES)` decorator
- Add `@MaxLength(50)` for status field

**Action 1.12**: Update `Todo.validateStatus()`

- Change to validate: non-empty string, max 50 chars (remove VALID_STATUSES hard dependency)
- Keep `VALID_STATUSES` exported constant for the pre-seeded defaults (used in datasource seeding)

---

### Phase 2: Frontend - Status Service & Hook

**Action 2.1**: Create `client/src/services/status-service.ts`

```typescript
export interface StatusOption {
  id: string;
  label: string;
  slug: string;
}
export const statusService = {
  getStatuses: () => httpClient.get<StatusOption[]>("/statuses"),
  createStatus: (label: string) => httpClient.post<StatusOption>("/statuses", { label }),
};
```

**Action 2.2**: Create `client/src/hooks/use-statuses.ts`

- Fetches statuses on mount
- Exposes: `statuses: StatusOption[]`, `createStatus(label)`, `isLoading`, `error`
- On `createStatus` success, appends new status to local list

**Action 2.3**: Update `client/src/types/todo.ts`

- Change `TodoStatus = string` (remove hard union to allow custom values)
- Keep interface `Todo` unchanged except status field type becomes `string`

**Action 2.4**: Update `client/src/constants/todo-statuses.ts`

- Keep `TODO_STATUSES` array for built-in reference
- Update `STATUS_LABELS` and `STATUS_COLORS` to use `Record<string, string>` with defaults
- Add `getStatusLabel(slug: string): string` — returns label or formatted slug fallback
- Add `getStatusColor(slug: string): string` — returns color or default fallback

**Action 2.5**: Update `client/src/schemas/todo.schema.ts`

- Change status field: `z.string().min(1).max(50)` instead of `z.enum(TODO_STATUSES)`

---

### Phase 3: Frontend - Inline Status Creation UI

**Action 3.1**: Update `client/src/components/edit-todo-form.tsx`

Add inline status creation:

- Below the status `<select>`, add: `<button type="button">+ Add new status</button>`
- When clicked, show an inline `<input>` with `<button type="button">Confirm</button>` and `<button type="button">Cancel</button>`
- On confirm: call `createStatus(newLabel)` from `useStatuses` hook
- On success: set the new slug as selected status
- Show loading and error states for inline creation
- Use `useStatuses` hook to populate the dropdown options dynamically

**Action 3.2**: Update `client/src/components/todo-form.tsx`

Add status selection + inline creation:

- Add a status `<select>` field (currently the form doesn't have one — add it)
- Same "Add new status" inline pattern as edit form
- Use `useStatuses` hook to populate options
- Pass selected status to `onSubmit` payload

---

### Phase 4: Styling

**Action 4.1**: Add CSS for inline status creation UI in `EditTodoForm.css`

- `.add-status-inline`: input + confirm/cancel buttons row
- `.status-creating`: loading state for inline creation

**Action 4.2**: Add CSS for inline status creation in `TodoForm.css`

- Same `.add-status-inline` styles

---

## Data Flow

```
User clicks "Add new status" in form
  ↓
Inline input appears (no page navigation)
  ↓
User types label (e.g., "In Review") → clicks Confirm
  ↓
createStatus("In Review") → POST /statuses { label: "In Review" }
  ↓
Backend generates slug: "in-review", saves to StatusDataSource
  ↓
Returns { id, label: "In Review", slug: "in-review" }
  ↓
Frontend appends to statuses list, selects "in-review" in dropdown
  ↓
User submits form → todo saved with status: "in-review"
```

## Files Summary

### Backend (CREATE)

- `server/src/statuses/domain/status.ts`
- `server/src/statuses/domain/statuses-list.ts`
- `server/src/statuses/datasource/status.datasource.ts`
- `server/src/statuses/repository/status.repository.ts`
- `server/src/statuses/dto/create-status.dto.ts`
- `server/src/statuses/dto/status.response.dto.ts`
- `server/src/statuses/query/get-statuses.query.ts`
- `server/src/statuses/command/create-status.command.ts`
- `server/src/statuses/status.controller.ts`
- `server/src/statuses/status.module.ts`

### Backend (MODIFY)

- `server/src/app.module.ts` — import StatusModule
- `server/src/todos/dto/create-todo.dto.ts` — remove @IsIn, add @MaxLength(50)
- `server/src/todos/dto/update-todo.dto.ts` — remove @IsIn, add @MaxLength(50)
- `server/src/todos/domain/todo.ts` — update validateStatus to non-empty string check

### Frontend (CREATE)

- `client/src/services/status-service.ts`
- `client/src/hooks/use-statuses.ts`

### Frontend (MODIFY)

- `client/src/types/todo.ts` — TodoStatus: string
- `client/src/constants/todo-statuses.ts` — dynamic fallbacks
- `client/src/schemas/todo.schema.ts` — z.string().min(1).max(50)
- `client/src/components/todo-form.tsx` — add status field with inline create
- `client/src/components/edit-todo-form.tsx` — add inline create to status select

## Testing Strategy

1. **Backend Unit Tests**
   - `Status.create()` generates correct slug
   - `CreateStatusCommand` throws on duplicate slug
   - `GET /statuses` returns pre-seeded statuses
   - `POST /statuses` creates and returns new status

2. **Frontend Unit Tests**
   - `useStatuses` hook fetches and appends statuses
   - Inline creation UI shows/hides correctly
   - New status selected after creation

3. **Integration Tests (QA)**
   - Create todo with custom status
   - Edit todo, create new status inline, save
   - New status persists in dropdown on re-open

## Success Criteria

- [x] `GET /statuses` returns 3 built-in statuses on startup
- [x] `POST /statuses { label: "In Review" }` creates status with slug `in-review`
- [x] Duplicate status creation returns error
- [x] Create todo form has status dropdown populated from API
- [x] Edit todo form has "Add new status" button
- [x] Inline input appears on click, disappears on cancel
- [x] New status appears as selected after creation
- [x] Todo saved with custom status slug
- [x] All ADRs followed (GEN-001, FE-002, FE-003, BE-002, BE-006)
- [x] TypeScript compiles without errors
- [x] No console errors

## Notes

- Slug generation rule: lowercase, spaces → hyphens, strip special chars (e.g. "In Review" → "in-review")
- Built-in statuses are pre-seeded (not protected from deletion by design - keep it simple)
- `TodoStatus` type becomes `string` on the FE — `STATUS_LABELS`/`STATUS_COLORS` fall back to slug as label and default color for unknown slugs
- The `kanban-board.tsx` and `kanban-column.tsx` use `TODO_STATUSES` for columns — these should be updated to use the dynamic statuses list from the API as well (out of scope for this story, but noted)
