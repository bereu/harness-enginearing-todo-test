---
id: LABEL-002
title: User can assign labels to a todo and see them displayed
user_story: User can add labels to a todo from the task detail modal, create new labels inline, and see labels displayed on each todo item
status: active
created_date: 2026-03-20
depends_on: LABEL-001
---

# User Can Assign Labels to a Todo

## Overview

Extend the todo detail (edit modal) with a label panel. Users can view existing labels, assign them to the todo, or create a new label inline (name + color picker). Label assignments are persisted via `PATCH /todos/:id` and displayed as colored badges on each todo card.

All backend additions remain **inside `server/src/todos/`** — no separate label module.

## User Story

**As a user**, I want to open a todo's detail, click "Add label", see existing labels, optionally create a new one with a name and color, and see assigned labels as colored badges on each todo item.

### Acceptance Criteria

1. **Todo detail (edit modal) shows a "Labels" section** with currently assigned labels
2. **"Add label" button opens a label picker** showing all existing labels
3. **User can toggle (assign/unassign) an existing label** from the picker
4. **"New label" option in picker** reveals an inline form: name input + 8 color swatches
5. **Confirming the inline form** creates the label via `POST /labels` and auto-assigns it
6. **Label assignment persists**: `PATCH /todos/:id` accepts `labelIds: string[]`
7. **Each todo card shows assigned labels** as colored `<span>` badges
8. **Color picker**: 8 preset hex colors defined in a named constant (GEN-001)
9. **Label name validation**: non-empty, max 100 chars; color: valid hex

## ADRs to Follow

- **BE-001**: Query/Command/Repository/DataSource layers; all inside the todos boundary
- **BE-002**: Todo-label association domain follows immutability rules
- **FE-002**: Zod schema updated for `labelIds`
- **FE-003**: Use configured Axios instance for label API calls
- **GEN-001**: No magic strings; preset colors in named constant

## Architecture Overview

### Backend — all inside `server/src/todos/`

```
server/src/todos/
├── domain/
│   ├── label-id.ts                    (existing from LABEL-001)
│   ├── label.ts                       (existing from LABEL-001)
│   ├── labels-list.ts                 (existing from LABEL-001)
│   └── todo.ts                        (existing)
├── datasource/
│   ├── label.datasource.ts            (existing from LABEL-001)
│   ├── todo-label.datasource.ts       (CREATE - junction: todoId ↔ labelId[])
│   └── todo.datasource.ts             (existing)
├── repository/
│   ├── label.repository.ts            (existing from LABEL-001)
│   ├── todo-label.repository.ts       (CREATE - resolves label IDs ↔ Label domains)
│   └── todo.repository.ts             (existing)
├── dto/
│   ├── label.response.dto.ts          (existing from LABEL-001)
│   ├── update-todo.dto.ts             (MODIFY - add labelIds?: string[])
│   └── todo.response.dto.ts           (MODIFY - add labels: LabelResponseDto[])
├── query/
│   ├── get-labels.query.ts            (existing from LABEL-001)
│   ├── get-labels-for-todo.query.ts   (CREATE - returns labels for one todo)
│   ├── get-todos.query.ts             (MODIFY - enrich with labels)
│   └── get-todo-by-id.query.ts        (MODIFY - enrich with labels)
├── command/
│   ├── create-label.command.ts        (existing from LABEL-001)
│   ├── set-labels-for-todo.command.ts (CREATE - replaces label set for a todo)
│   └── update-todo.command.ts         (MODIFY - handle labelIds)
├── todo.controller.ts                 (existing - label routes already added in LABEL-001)
└── todo.module.ts                     (MODIFY - add new providers)
```

### Frontend

```
client/src/
├── services/
│   └── label-service.ts            (CREATE - getLabels(), createLabel(name, color))
├── hooks/
│   └── use-labels.ts               (CREATE - fetch + cache labels, createLabel())
├── components/
│   ├── label-picker.tsx            (CREATE - list of labels + inline new label form)
│   ├── label-badge.tsx             (CREATE - colored span badge for a single label)
│   ├── edit-todo-form.tsx          (MODIFY - add Labels section with LabelPicker)
│   └── todo-item.tsx               (MODIFY - render label badges)
├── types/
│   └── todo.ts                     (MODIFY - add labels: Label[] to Todo interface)
└── constants/
    └── label-colors.ts             (CREATE - PRESET_COLORS: 8 hex values)
```

## Implementation Plan

### Phase 1: Backend — Todo-Label Association

**Action 1.1**: Create `TodoLabelDataSource` at `server/src/todos/datasource/todo-label.datasource.ts`

- In-memory `Map<todoId: string, Set<labelId: string>>`
- Methods:
  - `setLabels(todoId: string, labelIds: string[]): void` — replaces the entire set for a todo
  - `getLabelIds(todoId: string): string[]` — returns label IDs for one todo (empty array if none)

**Action 1.2**: Create `TodoLabelRepository` at `server/src/todos/repository/todo-label.repository.ts`

- Wraps `TodoLabelDataSource` and `LabelDataSource`
- `setLabels(todoId: string, labelIds: string[]): void`
- `getLabelsForTodo(todoId: string): Label[]` — resolves label IDs from `LabelDataSource` to `Label` domain objects

**Action 1.3**: Create `SetLabelsForTodoCommand` at `server/src/todos/command/set-labels-for-todo.command.ts`

- `execute(todoId: string, labelIds: string[]): void`
- Validates every `labelId` exists in `LabelRepository`; throws `BusinessLogicError` for any unknown ID
- Calls `todoLabelRepository.setLabels(todoId, labelIds)`

**Action 1.4**: Create `GetLabelsForTodoQuery` at `server/src/todos/query/get-labels-for-todo.query.ts`

- `execute(todoId: string): LabelResponseDto[]`
- Calls `todoLabelRepository.getLabelsForTodo(todoId)` and maps each `Label` to `LabelResponseDto`

**Action 1.5**: Update `TodoModule` at `server/src/todos/todo.module.ts`

Add to `providers`: `TodoLabelDataSource`, `TodoLabelRepository`, `SetLabelsForTodoCommand`, `GetLabelsForTodoQuery`

### Phase 2: Backend — Extend Todo DTOs & Queries

**Action 2.1**: Update `TodoResponseDto` at `server/src/todos/dto/todo.response.dto.ts`

- Add `labels: LabelResponseDto[]` field
- Update constructor signature to accept `labels: LabelResponseDto[]`

**Action 2.2**: Update `UpdateTodoDto` at `server/src/todos/dto/update-todo.dto.ts`

- Add `@IsArray() @IsUUID("4", { each: true }) @IsOptional() labelIds?: string[]`

**Action 2.3**: Update `GetTodosQuery` at `server/src/todos/query/get-todos.query.ts`

- Inject `GetLabelsForTodoQuery`
- For each todo, call `getLabelsForTodoQuery.execute(todo.id().value())`
- Include result in `TodoResponseDto` as `labels`

**Action 2.4**: Update `GetTodoByIdQuery` at `server/src/todos/query/get-todo-by-id.query.ts`

- Same enrichment as `GetTodosQuery`

**Action 2.5**: Update `UpdateTodoCommand` at `server/src/todos/command/update-todo.command.ts`

- Inject `SetLabelsForTodoCommand`
- If `dto.labelIds` is defined, call `setLabelsForTodoCommand.execute(todoId, dto.labelIds)` after other updates

### Phase 3: Frontend — Label Service & Hook

**Action 3.1**: Create `client/src/services/label-service.ts`

```typescript
import { httpClient } from "@/services/http-client";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export const labelService = {
  getLabels: () => httpClient.get<Label[]>("/labels"),
  createLabel: (name: string, color: string) => httpClient.post<Label>("/labels", { name, color }),
};
```

**Action 3.2**: Create `client/src/hooks/use-labels.ts`

- Fetches all labels on mount via `labelService.getLabels()`
- Exposes: `labels: Label[]`, `createLabel(name, color): Promise<Label>`, `isLoading: boolean`, `error: string | null`
- On `createLabel` success, appends new label to local `labels` state

**Action 3.3**: Update `client/src/types/todo.ts`

- Add `Label` interface: `{ id: string; name: string; color: string }`
- Add `labels: Label[]` to `Todo` interface
- Add `labelIds?: string[]` to `CreateTodoPayload`

**Action 3.4**: Create `client/src/constants/label-colors.ts`

```typescript
// GEN-001: named constants, no magic strings
export const PRESET_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#6B7280", // gray
] as const;

export type PresetColor = (typeof PRESET_COLORS)[number];
```

### Phase 4: Frontend — Components

**Action 4.1**: Create `client/src/components/label-badge.tsx`

```tsx
interface LabelBadgeProps {
  label: Label;
  onRemove?: () => void;
}
// <span className="label-badge" style={{ backgroundColor: label.color }}>
//   {label.name}
//   {onRemove && <button type="button" onClick={onRemove}>✕</button>}
// </span>
```

Create `client/src/components/LabelBadge.css` alongside it.

**Action 4.2**: Create `client/src/components/label-picker.tsx`

Props:

- `allLabels: Label[]`
- `assignedLabelIds: string[]`
- `onToggle(labelId: string): void`
- `onCreateLabel(name: string, color: string): Promise<void>`

UI States:

- **List view**: each label shown with checkbox (checked if in `assignedLabelIds`)
- **"+ New label" button** at the bottom of the list
- **Inline form** (when "New label" clicked):
  - Text input for name
  - 8 color swatches from `PRESET_COLORS`; first one selected by default
  - `Confirm` button (disabled if name empty) and `Cancel` button
- On Confirm: call `onCreateLabel(name, selectedColor)`; close inline form

Create `client/src/components/LabelPicker.css` alongside it.

**Action 4.3**: Update `client/src/components/edit-todo-form.tsx`

- Add `useLabels()` hook
- Add state: `assignedLabelIds: string[]` initialized from `todo.labels.map(l => l.id)`
- Add state: `isPickerOpen: boolean`
- Add **Labels section** in the form (below Status):

```tsx
<div className="form-group">
  <label>Labels</label>
  <div className="assigned-labels">
    {assignedLabelIds.map((id) => {
      const label = labels.find((l) => l.id === id);
      return label ? (
        <LabelBadge
          key={id}
          label={label}
          onRemove={() => setAssignedLabelIds((prev) => prev.filter((x) => x !== id))}
        />
      ) : null;
    })}
  </div>
  <button type="button" onClick={() => setIsPickerOpen(true)}>
    + Add label
  </button>
  {isPickerOpen && (
    <LabelPicker
      allLabels={labels}
      assignedLabelIds={assignedLabelIds}
      onToggle={(id) =>
        setAssignedLabelIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        )
      }
      onCreateLabel={async (name, color) => {
        const created = await createLabel(name, color);
        setAssignedLabelIds((prev) => [...prev, created.id]);
      }}
    />
  )}
</div>
```

- On form submit: include `labelIds: assignedLabelIds` in the payload alongside title/description/status

**Action 4.4**: Update `client/src/components/todo-item.tsx`

- Import `LabelBadge`
- Add inside `.todo-content` below the date:
  ```tsx
  {
    todo.labels.length > 0 && (
      <div className="todo-labels">
        {todo.labels.map((label) => (
          <LabelBadge key={label.id} label={label} />
        ))}
      </div>
    );
  }
  ```

**Action 4.5**: Add `.todo-labels` styles to `client/src/components/TodoItem.css`

```css
.todo-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
```

## Data Flow

```
User opens edit todo modal
  ↓
EditTodoForm mounts → useLabels() fetches GET /labels
  ↓
Labels section shows assigned labels as removable LabelBadges
  ↓
User clicks "+ Add label" → LabelPicker opens
  ↓
User clicks "+ New label" → inline form appears (name input + color swatches)
  ↓
User fills name "Bug", picks red swatch → clicks Confirm
  ↓
onCreateLabel("Bug", "#EF4444") → POST /labels { name, color }
  ↓
  TodoController → CreateLabelCommand → Label.create() → LabelRepository.save()
  ↓
New label returned → auto-added to assignedLabelIds
  ↓
User clicks Save
  ↓
PATCH /todos/:id { labelIds: ["uuid-bug", ...] }
  ↓
  UpdateTodoCommand → SetLabelsForTodoCommand → TodoLabelRepository.setLabels()
  ↓
GET /todos → GetTodosQuery → enriches each todo with GetLabelsForTodoQuery
  ↓
TodoItem renders LabelBadge for each label
```

## Files Summary

### Backend (CREATE)

- `server/src/todos/datasource/todo-label.datasource.ts`
- `server/src/todos/repository/todo-label.repository.ts`
- `server/src/todos/command/set-labels-for-todo.command.ts`
- `server/src/todos/query/get-labels-for-todo.query.ts`

### Backend (MODIFY)

- `server/src/todos/todo.module.ts` — add `TodoLabelDataSource`, `TodoLabelRepository`, `SetLabelsForTodoCommand`, `GetLabelsForTodoQuery`
- `server/src/todos/dto/todo.response.dto.ts` — add `labels: LabelResponseDto[]`
- `server/src/todos/dto/update-todo.dto.ts` — add `labelIds?: string[]`
- `server/src/todos/query/get-todos.query.ts` — enrich with labels
- `server/src/todos/query/get-todo-by-id.query.ts` — enrich with labels
- `server/src/todos/command/update-todo.command.ts` — call `SetLabelsForTodoCommand` when `labelIds` present

### Frontend (CREATE)

- `client/src/services/label-service.ts`
- `client/src/hooks/use-labels.ts`
- `client/src/constants/label-colors.ts`
- `client/src/components/label-badge.tsx`
- `client/src/components/LabelBadge.css`
- `client/src/components/label-picker.tsx`
- `client/src/components/LabelPicker.css`

### Frontend (MODIFY)

- `client/src/types/todo.ts` — add `Label` interface, `labels: Label[]` to `Todo`
- `client/src/components/edit-todo-form.tsx` — add Labels section
- `client/src/components/todo-item.tsx` — render label badges
- `client/src/components/TodoItem.css` — add `.todo-labels`

## Testing Strategy

1. **Backend Unit Tests** (inside `server/src/todos/`)
   - `SetLabelsForTodoCommand` throws `BusinessLogicError` on unknown label ID
   - `SetLabelsForTodoCommand` replaces label set idempotently
   - `GetLabelsForTodoQuery` returns empty array for a new todo
   - `UpdateTodoCommand` calls `SetLabelsForTodoCommand` when `labelIds` present
   - `GET /todos` response includes `labels: []` per todo initially
   - `PATCH /todos/:id { labelIds }` updates labels; `GET /todos` reflects the change

2. **Frontend Tests**
   - `LabelPicker` renders all labels as checkboxes; checked ones match `assignedLabelIds`
   - Inline form appears on "+ New label" click; disappears on cancel
   - New label is auto-assigned after creation
   - `LabelBadge` renders with correct `backgroundColor`
   - `todo-item` renders badges when `todo.labels` is non-empty

3. **Integration (QA)**
   - Create label via `POST /labels`; assign to todo; verify badge on card
   - Edit todo; remove label; save; verify badge gone
   - Create new label inline in picker; verify it appears in picker and as badge

## Success Criteria

- [x] `PATCH /todos/:id { labelIds: [] }` clears all labels
- [x] `PATCH /todos/:id { labelIds: ["valid-id"] }` assigns label correctly
- [x] `GET /todos` returns `labels: [{ id, name, color }]` per todo
- [x] Edit todo modal shows Labels section with assigned labels
- [x] LabelPicker shows all existing labels with toggle checkboxes
- [x] New label inline form validates name and requires color
- [x] Created label is auto-assigned and appears immediately
- [x] LabelBadge renders with correct `backgroundColor` from label color
- [x] Todo cards show colored label badges
- [x] All label files live under `server/src/todos/`; no separate label module
- [x] All ADRs followed (BE-001, BE-002, FE-002, FE-003, GEN-001)
- [x] TypeScript compiles without errors
- [ ] No console errors
