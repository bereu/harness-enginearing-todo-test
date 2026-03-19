---
id: EDIT-TODO-001
title: Edit Todo Feature
user_story: User can edit todo by clicking and opening a popup modal to edit title, description, and status
status: planning
created_date: 2026-03-19
---

# Edit Todo Feature Plan

## Overview

Enable users to edit existing todos through a modal dialog. Users will be able to click on a todo item to open a popup where they can modify the title, description, and status.

## User Story

**As a user**, I want to click on a todo item and edit its title, description, and status in a popup modal so that I can update my tasks without creating new ones.

### Acceptance Criteria

1. **User clicks on a todo item** → A modal dialog appears with the current todo data
2. **Modal displays editable fields** → Title, description, and status dropdown
3. **User can edit fields** → All three fields should be editable
4. **Form validation** → Same rules as creation (title required, max lengths enforced)
5. **User can save changes** → Changes are persisted to the backend via PATCH /todos/:id
6. **User can cancel** → Modal closes without making changes
7. **Error handling** → Display error messages if save fails
8. **Loading state** → Disable form while saving

## Architecture & Design Decisions

### ADRs to Follow

- **FE-002 (Form Validation with Zod)**: Create and use Zod schema for edit form validation
- **FE-003 (HTTP Client with Axios)**: Use configured Axios instance for PATCH request
- **BE-002 (Domain Rules)**: Backend already follows immutability; frontend consumes Todo domain
- **GEN-001 (Status Management)**: Use TODO_STATUSES constant, never use magic strings

### Technology Stack

- **Frontend**: React + Vite
- **HTTP Client**: Axios (pre-configured instance)
- **Form Validation**: Zod + React Hook Form (optional, state-based is fine too)
- **Modal**: HTML dialog or custom div-based modal (CSS-based)
- **Styling**: Tailwind CSS or existing CSS files

## Implementation Plan

### Phase 1: Form Component

**Files to create:**

- `client/src/components/edit-todo-modal.tsx` - Modal wrapper component
- `client/src/components/edit-todo-form.tsx` - Form with fields and validation

**Files to modify:**

- `client/src/schemas/todo.schema.ts` - Add `EditTodoSchema` (or reuse `UpdateTodoSchema`)
- `client/src/types/todo.ts` - Add `UpdateTodoPayload` type if needed

**Requirements:**

- Modal component accepts `isOpen: boolean`, `onClose: () => void`, and `todo: Todo`
- Form component has:
  - Title input (required, max 255 chars)
  - Description textarea (optional, max 2000 chars)
  - Status dropdown (todo, in-progress, done)
  - Save and Cancel buttons
- Use Zod schema from `todo.schema.ts` (UpdateTodoSchema already exists)
- Display validation errors with aria labels
- Show loading state during submit
- Follow FE-002 and FE-003 ADRs

### Phase 2: Modal Integration

**Files to modify:**

- `client/src/components/todo-item.tsx` - Add click handler to open modal
- `client/src/components/todo-list.tsx` - Manage modal state and pass handlers

**Requirements:**

- Add click event to TodoItem to trigger modal
- Use state hook to track which todo is being edited
- Pass callbacks (`onClose`, `onSave`) to modal
- Handle loading and error states

### Phase 3: API Integration

**Files to modify:**

- `client/src/services/todo-service.ts` - Already has `updateTodo()` method, verify it works

**Requirements:**

- Call `todoService.updateTodo(id, updatePayload)` on form submit
- Handle success: close modal and refresh todo list
- Handle errors: display error message in modal
- Follow error handling per FE-001

### Phase 4: UI/UX Enhancements

**Files to create/modify:**

- CSS files for modal styling (modal backdrop, dialog, animations)
- Accessibility: aria-modal, focus management, keyboard support (ESC to close)

**Requirements:**

- Modal should be visually distinct (overlay, centered)
- Animations for open/close (fade-in/out)
- Handle ESC key to close
- Trap focus inside modal while open
- Properly labeled form fields

## Data Flow

```
TodoItem (click)
  ↓
TodoList (state: which todo is being edited?)
  ↓
EditTodoModal (isOpen, todo, onClose, onSave)
  ↓
EditTodoForm (submit handler)
  ↓
todoService.updateTodo(id, payload)
  ↓
PATCH /todos/:id (Backend)
  ↓
Success: Close modal, refresh list
Error: Show error in modal
```

## Files Structure

```
client/src/
├── components/
│   ├── todo-item.tsx (MODIFY - add click handler)
│   ├── todo-list.tsx (MODIFY - add modal state)
│   ├── edit-todo-modal.tsx (CREATE - modal wrapper)
│   ├── edit-todo-form.tsx (CREATE - form with fields)
│   └── edit-todo-modal.css (CREATE - styles)
├── schemas/
│   └── todo.schema.ts (VERIFY - UpdateTodoSchema exists)
├── types/
│   └── todo.ts (CHECK - UpdateTodoPayload type)
└── services/
    └── todo-service.ts (VERIFY - updateTodo method works)
```

## Backend Status

✅ **Already Implemented**

- PATCH /todos/:id endpoint exists
- UpdateTodoCommand handles business logic
- UpdateTodoDto validates input
- Domain Todo class is immutable

No backend changes needed.

## Testing Strategy

1. **Unit Tests**
   - EditTodoForm validation (Zod schema)
   - Modal open/close state management

2. **Integration Tests**
   - Click todo → modal opens
   - Fill form → submit → API call made
   - Success → modal closes, list updates
   - Error → error message displayed

3. **E2E Tests**
   - Full flow: click todo → edit fields → save → verify changes

## Success Criteria

- [x] EditTodoModal component created and renders correctly
- [x] EditTodoForm component created with full validation
- [x] TodoItem accepts click events and triggers modal
- [x] TodoList manages modal state
- [x] Form submits PATCH request with correct data
- [x] Errors are handled and displayed
- [x] Modal closes on cancel/ESC
- [x] Form prefills with current todo data
- [x] All ADRs followed (FE-002, FE-003, GEN-001)
- [x] No console errors or warnings
- [x] Accessible (aria labels, keyboard support)

## Dependencies & Risks

**Existing Dependencies:**

- Zod (already in project)
- Axios (already configured)
- React Hook Form (may or may not be installed - check package.json)

**Risks:**

- Modal styling conflicts with existing styles
- Focus management complexity in modal
- Test coverage for async operations

## Notes

- The `UpdateTodoSchema` already exists in `client/src/schemas/todo.schema.ts` - reuse it
- The `todoService.updateTodo()` method already exists - just call it
- Backend PATCH endpoint is ready - no changes needed
- Consider whether to use React Hook Form or simple state management
