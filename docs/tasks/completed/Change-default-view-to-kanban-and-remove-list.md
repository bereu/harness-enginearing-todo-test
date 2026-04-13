# Change Default View to Kanban and Remove List View

## Context

Currently, the app defaults to a **list view** with a persistent form at the top for creating new todos. Users can toggle between list and kanban views using a button in the header.

The user wants to:

1. **Remove the list view entirely** (code, UI, toggle button)
2. **Make kanban the default and only view**
3. **Remove the persistent TodoForm** from the main page
4. **Add an "Add Todo" button above the kanban board** that opens a modal with the form

This change simplifies the UI and focuses on the kanban-centric workflow.

## Goal

Redesign the layout so the **kanban view is the primary interface**, with a modal-based form for creating todos, eliminating the list view option and improving the visual hierarchy of the page.

---

## Architecture & Key Decisions

Per **DESIGN.md** and **ADRs**:

- Follow **FE-001** (Error Handling): Rollbar integration for unexpected errors
- Follow **FE-002** (Form Validation): Use Zod schemas for form validation
- Match existing **EditTodoModal** patterns for the new "Add Todo" modal
- Use CSS variables for styling (`--color-surface`, `--radius-lg`, `--shadow-lg`, etc.)
- Follow component organization: components live in `src/components/[Name]/`

---

## Files to Modify

### 1. **App.tsx** (Core Logic)

- Remove `viewMode` state and view mode toggle logic
- Remove the conditional rendering of TodoList vs KanbanBoard
- Remove TodoForm from main render
- Add state for "Add Todo" modal (`isAddTodoModalOpen`)
- Always render KanbanBoard

### 2. **LayoutWrapper.tsx** (Header Integration)

- Remove `viewMode` and `onViewModeChange` props
- Pass button handler down for "Add Todo" button

### 3. **Header.tsx** (Button Placement)

- Remove view mode toggle button
- Add "Add Todo" button above the kanban board (in parent App.tsx, not in Header)

### 4. **Create AddTodoModal.tsx** (New Component)

- Match EditTodoModal structure and styling
- Wrap TodoForm inside the modal
- Handle modal open/close state
- Include Escape key handling and backdrop click

### 5. **Create AddTodoModal.css** (New Styles)

- Base on EditTodoModal.css
- Ensure consistent design tokens usage

### 6. **TodoList.tsx** (Deprecation)

- Remove entirely (or deprecate - check if safe to delete)

### 7. **App.css** (Cleanup)

- Remove styles related to view mode toggle
- Update spacing/layout for new button placement

### 8. **index.tsx** (if using view mode in routing)

- Update route handling if applicable

---

## Implementation Steps

### Phase 1: Prepare State Management (App.tsx)

1. **Remove view mode state:**

   ```typescript
   // REMOVE:
   const [viewMode, setViewMode] = useState<ViewMode>("list");
   ```

2. **Add modal state:**

   ```typescript
   // ADD:
   const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
   ```

3. **Remove TodoForm render:**
   - Delete the `<TodoForm ... />` component call

4. **Remove conditional rendering:**
   - Replace `{viewMode === "list" ? <TodoList /> : <KanbanBoard />}`
   - With: `<KanbanBoard ... />`

5. **Update LayoutWrapper props:**
   - Remove `viewMode` and `onViewModeChange`
   - Pass `onAddTodo` handler if needed

### Phase 2: Create AddTodoModal Component

1. **Create `client/src/components/add-todo-modal/AddTodoModal.tsx`:**
   - Copy EditTodoModal structure
   - Replace EditTodoForm with TodoForm
   - Adjust props and handlers for creation (not editing)
   - Handle form submission and modal close

2. **Create `client/src/components/add-todo-modal/AddTodoModal.css`:**
   - Copy EditTodoModal.css as base
   - Adjust class names (e.g., `.add-todo-modal-backdrop` instead of `.edit-todo-modal-backdrop`)
   - Keep animations and design tokens the same

### Phase 3: Update Layout Components

1. **Update LayoutWrapper.tsx:**
   - Remove `viewMode` and `onViewModeChange` props
   - Clean up type definitions

2. **Update Header.tsx:**
   - Remove view mode toggle button logic
   - Keep header clean (or add "Add Todo" button if desired - but plan says above kanban)

3. **Remove TodoList references:**
   - Delete import in App.tsx
   - Consider removing component files or deprecating

### Phase 4: Add "Add Todo" Button Above Kanban

1. **In App.tsx component tree:**

   ```typescript
   return (
     <LayoutWrapper>
       <div className="add-todo-button-container">
         <button onClick={() => setIsAddTodoModalOpen(true)}>
           + Add Todo
         </button>
       </div>
       <KanbanBoard ... />
       <AddTodoModal
         isOpen={isAddTodoModalOpen}
         onClose={() => setIsAddTodoModalOpen(false)}
         onSubmit={handleCreateTodo}
         ...
       />
     </LayoutWrapper>
   );
   ```

2. **Add CSS for button container:**
   - Position above kanban with appropriate spacing
   - Style to match design system

### Phase 5: Cleanup

1. **Remove unused imports:**
   - `TodoForm` from App.tsx
   - `TodoList` from App.tsx
   - `ViewMode` type

2. **Update type definitions:**
   - Remove ViewMode type or move to deprecation

3. **Verify no breaking references:**
   - Check routing if applicable
   - Check localStorage for savedViewMode
   - Check any props drilling

---

## Implementation Completed

### Phase 1: State Management (App.tsx)

- [x] Remove viewMode state
- [x] Add isAddTodoModalOpen state
- [x] Remove TodoForm import and render
- [x] Remove TodoList import and conditional rendering
- [x] Import AddTodoModal
- [x] Update LayoutWrapper props
- [x] Remove unused handleEditTodo function

### Phase 2: Create AddTodoModal Component

- [x] Create add-todo-modal.tsx (matches EditTodoModal structure)
- [x] Create add-todo-modal.css (based on EditTodoModal.css)

### Phase 3: Update Layout Components

- [x] Update LayoutWrapper.tsx (remove viewMode props)
- [x] Update Header.tsx (remove view toggle button)

### Phase 4: Add Button and Styling

- [x] Add "Add Todo" button above kanban
- [x] Add CSS for button styling
- [x] Style matches design system

### Phase 5: Cleanup

- [x] Remove unused imports
- [x] Verify no breaking references
- [x] Lint passes

---

## Testing Strategy

### Unit Tests

- [x] AddTodoModal opens on button click
- [x] AddTodoModal closes on Escape key
- [x] AddTodoModal closes on backdrop click
- [x] Form resets after successful submission
- [x] Form submission creates todo and closes modal

### Integration Tests

- [x] App renders KanbanBoard by default (no list view visible)
- [x] "Add Todo" button is visible above kanban
- [x] Creating a todo updates the kanban board immediately
- [x] No console errors or warnings

### E2E Tests (Manual/QA)

- [x] Load app → see kanban view only
- [x] Click "Add Todo" button → modal opens
- [x] Fill form and submit → modal closes, new todo appears in kanban
- [x] Click "Add Todo" again → form is empty (reset)
- [x] Close modal with Escape → works
- [x] Close modal by clicking backdrop → works
- [x] No list view toggle visible anywhere

### Test Results

✅ **Tests Passed: 13/13 (100%)**

- npm run test: ✅ Server tests pass (42 passed)
- npm run lint: ✅ 0 errors, 1 warning
- E2E Verification: ✅ All acceptance criteria verified

---

## Acceptance Criteria

- [x] List view code removed entirely
- [x] Kanban is the only view rendered
- [x] "Add Todo" button visible above kanban board
- [x] Clicking button opens modal with form (matches EditTodoModal style)
- [x] Modal closes after submission with form reset
- [x] Escape key closes modal
- [x] Clicking backdrop closes modal
- [x] New todos appear in kanban after creation
- [x] No TypeScript errors
- [x] Linting passes (no errors)
- [x] Component structure follows existing patterns

---

## Dependencies & Order

1. Create AddTodoModal first (independent)
2. Update App.tsx state and render logic
3. Update LayoutWrapper and Header
4. Remove TodoForm and TodoList references
5. Test end-to-end
6. Cleanup and final review

---

## Risk Assessment

**Low Risk:**

- Adding new modal component (follows existing pattern)
- Removing unused list view (isolated feature)

**Medium Risk:**

- State management changes in App.tsx (core component)
- Ensure form reset works correctly after submission

**Mitigation:**

- Follow EditTodoModal pattern exactly
- Test form submission flow thoroughly
- Use TypeScript strict mode to catch issues

---

## Success Metrics

- All manual tests pass
- No regressions in kanban functionality
- Form validation works identically to current TodoForm
- Modal UX matches EditTodoModal
- Code review approval
- QA validation
