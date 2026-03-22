---
id: LABEL-001
title: User can create a label
user_story: User can create a label with a name and color via the backend API
status: active
created_date: 2026-03-20
---

# User Can Create a Label

## Overview

Introduce a `Label` entity **inside the todo domain**. Labels have a name (text) and a color (hex string). The label domain, datasource, repository, DTOs, query, command, and controller routes all live under `server/src/todos/` — no separate module. The `TodoModule` and `TodoController` are extended to serve label endpoints.

## User Story

**As a user**, I want to create labels with a name and color so that I can tag todos with visual identifiers.

### Acceptance Criteria

1. `GET /labels` returns all existing labels
2. `POST /labels { name, color }` creates a new label and returns it
3. Label name: non-empty, max 100 characters
4. Label color: valid hex color string (e.g. `#FF5733`)
5. Duplicate label names are rejected with a business logic error
6. Label has fields: `id` (UUID), `name` (string), `color` (hex string)

## ADRs to Follow

- **BE-001**: Controller → Query/Command → Repository → DataSource layer pattern; all inside the todos boundary
- **BE-002**: Label domain must be immutable, self-validating, getter-only
- **BE-003**: Use `BusinessLogicError` for duplicate name
- **BE-005**: `LabelId` as a Value Domain
- **BE-006**: `LabelsList` domain for managing collections

## Architecture Overview

Everything lives **inside `server/src/todos/`**. No new NestJS module is created.

```
server/src/todos/
├── domain/
│   ├── label-id.ts              (CREATE - Value Domain: UUID wrapper)
│   ├── label.ts                 (CREATE - Label domain: id, name, color)
│   ├── labels-list.ts           (CREATE - LabelsList domain)
│   ├── todo.ts                  (existing)
│   ├── todo-id.ts               (existing)
│   ├── todo-title.ts            (existing)
│   └── todos-list.ts            (existing)
├── datasource/
│   ├── label.datasource.ts      (CREATE - in-memory label store)
│   └── todo.datasource.ts       (existing)
├── repository/
│   ├── label.repository.ts      (CREATE - maps datasource ↔ domain)
│   └── todo.repository.ts       (existing)
├── dto/
│   ├── create-label.dto.ts      (CREATE - validation DTO)
│   ├── label.response.dto.ts    (CREATE - response shape)
│   ├── create-todo.dto.ts       (existing)
│   ├── update-todo.dto.ts       (existing)
│   └── todo.response.dto.ts     (existing)
├── query/
│   ├── get-labels.query.ts      (CREATE - list all labels)
│   ├── get-todos.query.ts       (existing)
│   ├── get-todo-by-id.query.ts  (existing)
│   └── get-todos-by-status.query.ts (existing)
├── command/
│   ├── create-label.command.ts  (CREATE - business logic for label creation)
│   ├── create-todo.command.ts   (existing)
│   └── update-todo.command.ts   (existing)
├── todo.controller.ts           (MODIFY - add GET /labels, POST /labels routes)
└── todo.module.ts               (MODIFY - add new providers)
```

## Implementation Plan

### Phase 1: Domain Layer

**Action 1.1**: Create `LabelId` value domain at `server/src/todos/domain/label-id.ts`

- Private constructor, `_value: string`
- `static create(id?: string): LabelId` — generates UUID if not provided
- `static of(id: string): LabelId` — throws if empty
- `value(): string`, `equals(other: LabelId): boolean`
- Follows BE-005 pattern (same as `TodoId`)

**Action 1.2**: Create `Label` domain at `server/src/todos/domain/label.ts`

- Private constructor, all fields `readonly`
- Fields: `_id: LabelId`, `_name: string`, `_color: string`
- `static create(name: string, color: string): Label` — generates new UUID
- `static reconstruct(id, name, color): Label`
- Validates in constructor:
  - name: non-empty, max 100 chars
  - color: matches `/^#[0-9A-Fa-f]{6}$/`
- Getters: `id(): LabelId`, `name(): string`, `color(): string`

**Action 1.3**: Create `LabelsList` domain at `server/src/todos/domain/labels-list.ts`

- Follows BE-006 pattern (same as `TodosList`)
- Private `list: Label[]`
- `static create(labels: Label[]): LabelsList`
- `static empty(): LabelsList`
- Methods: `getAll(): Label[]`, `findById(id: string): Label | null`, `nameExists(name: string): boolean`, `add(label: Label): LabelsList`

### Phase 2: Data Layer

**Action 2.1**: Create `LabelDataSource` at `server/src/todos/datasource/label.datasource.ts`

- Interface `LabelDataSourceModel { id: string; name: string; color: string }`
- In-memory array, no pre-seeding
- Methods: `save(model): void`, `findAll(): LabelDataSourceModel[]`, `findById(id: string): LabelDataSourceModel | null`

**Action 2.2**: Create `LabelRepository` at `server/src/todos/repository/label.repository.ts`

- Wraps `LabelDataSource`
- `findAll(): LabelsList`
- `save(label: Label): void`
- `findByName(name: string): Label | null`

### Phase 3: DTOs

**Action 3.1**: Create `CreateLabelDto` at `server/src/todos/dto/create-label.dto.ts`

```typescript
import { IsString, IsNotEmpty, MaxLength, Matches } from "class-validator";

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: "color must be a valid hex color (e.g. #FF5733)" })
  color: string;
}
```

**Action 3.2**: Create `LabelResponseDto` at `server/src/todos/dto/label.response.dto.ts`

```typescript
export class LabelResponseDto {
  id: string;
  name: string;
  color: string;
}
```

### Phase 4: Query & Command

**Action 4.1**: Create `GetLabelsQuery` at `server/src/todos/query/get-labels.query.ts`

- `execute(): LabelResponseDto[]`
- Calls `labelRepository.findAll().getAll()`, maps to `LabelResponseDto`

**Action 4.2**: Create `CreateLabelCommand` at `server/src/todos/command/create-label.command.ts`

- `execute(dto: CreateLabelDto): LabelResponseDto`
- Check name uniqueness via `labelRepository.findByName(dto.name)`; throw `BusinessLogicError` if exists
- Create `Label.create(dto.name, dto.color)`
- Save via `labelRepository.save(label)`
- Return `LabelResponseDto`

### Phase 5: Controller & Module

**Action 5.1**: Update `TodoController` at `server/src/todos/todo.controller.ts`

Add label routes alongside existing todo routes:

```typescript
@Get("/labels")
getLabels() { return this.getLabelsQuery.execute(); }

@Post("/labels")
createLabel(@Body() dto: CreateLabelDto) { return this.createLabelCommand.execute(dto); }
```

**Action 5.2**: Update `TodoModule` at `server/src/todos/todo.module.ts`

Add to `providers`: `LabelDataSource`, `LabelRepository`, `GetLabelsQuery`, `CreateLabelCommand`

## Data Flow

```
POST /labels { name: "Bug", color: "#FF0000" }
  ↓
TodoController.createLabel() → CreateLabelDto validated
  ↓
CreateLabelCommand checks name uniqueness via LabelRepository
  ↓
Label.create("Bug", "#FF0000") → Label domain object
  ↓
LabelRepository.save(label) → LabelDataSource stores model
  ↓
Returns LabelResponseDto { id, name: "Bug", color: "#FF0000" }
```

## Files Summary

### Backend (CREATE)

- `server/src/todos/domain/label-id.ts`
- `server/src/todos/domain/label.ts`
- `server/src/todos/domain/labels-list.ts`
- `server/src/todos/datasource/label.datasource.ts`
- `server/src/todos/repository/label.repository.ts`
- `server/src/todos/dto/create-label.dto.ts`
- `server/src/todos/dto/label.response.dto.ts`
- `server/src/todos/query/get-labels.query.ts`
- `server/src/todos/command/create-label.command.ts`

### Backend (MODIFY)

- `server/src/todos/todo.controller.ts` — add `GET /labels`, `POST /labels`
- `server/src/todos/todo.module.ts` — add label providers

## Testing Strategy

1. **Unit Tests** (inside `server/src/todos/`)
   - `Label.create()` validates name and color format
   - `Label.create()` throws on invalid hex (e.g. `"red"`)
   - `Label.create()` throws on empty name
   - `CreateLabelCommand` throws `BusinessLogicError` on duplicate name
   - `GetLabelsQuery` returns empty list initially
   - `POST /labels` returns 201 with `{ id, name, color }`
   - `GET /labels` returns all created labels

## Success Criteria

- [x] `GET /labels` returns `[]` on startup
- [x] `POST /labels { name: "Bug", color: "#FF0000" }` returns `{ id, name, color }`
- [x] `POST /labels` with duplicate name returns 4xx business logic error
- [x] `POST /labels` with invalid hex (e.g. `"red"`) returns 400 validation error
- [x] `POST /labels` with empty name returns 400 validation error
- [x] All label files live under `server/src/todos/`
- [x] No new NestJS module created
- [x] All ADRs followed (BE-001, BE-002, BE-003, BE-005, BE-006)
- [x] TypeScript compiles without errors
