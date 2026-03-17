# Add TODO Feature - Implementation Plan

**Status:** planning
**Created:** 2026-03-15

---

## Context

This plan implements core TODO CRUD functionality following the established architecture decisions:
- **BE-001**: Lauer Architecture (Controller → Coordinator → Query/Command → Repository → DataSource)
- **BE-002**: Domain Class Rules (immutability, self-validation, no setters)
- **GEN-001**: Import Rules (named imports, path aliases, no relative paths)

---

## Architecture Decisions

The TODO feature will follow the layered architecture:
1. **Controller Layer** (entry point) → TodoController
2. **Coordinator Layer** (orchestration) → TodoCoordinator
3. **Query/Command Layers** (business logic) → GetTodosQuery, CreateTodoCommand
4. **Repository Layer** → TodoRepository
5. **DataSource Layer** → TodoDataSource (in-memory for Phase 1)
6. **Domain Layer** → Todo domain object with validation in constructor

---

## Backend (NestJS)

### Phase 1: Domain & DTOs

#### 1.1 Create Todo Domain Class
**File:** `server/src/todos/domain/todo.ts`
- Immutable domain object (getters only, no setters)
- Properties:
  - `_id`: string (UUID) - private, accessed via `id()`
  - `_title`: string (required, 1-255 chars) - private, accessed via `title()`
  - `_description`: string | null (optional) - private, accessed via `description()`
  - `_completed`: boolean (default: false) - private, accessed via `completed()`
  - `_createdAt`: Date - private, accessed via `createdAt()`
- Constructor validates all business rules and throws errors if invalid
- No async operations in constructor

#### 1.2 Create Value Domains
**Files:**
- `server/src/todos/domain/todo-id.ts` - TodoId value domain
- `server/src/todos/domain/todo-title.ts` - TodoTitle value domain

#### 1.3 Create DTOs
**Files:**
- `server/src/todos/dto/create-todo.dto.ts` - DTO with basic API validation (@IsString, @IsNotEmpty, etc.)
- `server/src/todos/dto/todo.response.dto.ts` - Response DTO for API
- Use class-validator decorators for basic field validation only
- Business validation happens in Domain constructor

### Phase 2: Data Layer (Repository & DataSource)

#### 2.1 Create TodoDataSource
**File:** `server/src/todos/datasource/todo.datasource.ts`
- In-memory storage for Phase 1
- Properties: `private todos: TodoDatasource[] = []`
- Methods:
  - `save(todo: TodoDatasource): void`
  - `findAll(): TodoDatasource[]`
  - `findById(id: string): TodoDatasource | null`
  - `delete(id: string): void`

#### 2.2 Create TodoRepository
**File:** `server/src/todos/repository/todo.repository.ts`
- Aggregates access to TodoDataSource
- Methods:
  - `add(todo: Todo): void`
  - `getAll(): Todo[]`
  - `getById(id: TodoId): Todo | null`
  - `remove(id: TodoId): void`
- Maps between Domain and DataSource

### Phase 3: Business Logic Layer (Query & Command)

#### 3.1 Create GetTodosQuery
**File:** `server/src/todos/query/get-todos.query.ts`
- Read-only operation
- Method: `execute(): Todo[]`
- Uses TodoRepository for data retrieval

#### 3.2 Create CreateTodoCommand
**File:** `server/src/todos/command/create-todo.command.ts`
- Write operation
- Method: `execute(title: string, description?: string): Todo`
- Creates Todo domain object (validates in constructor)
- Saves via TodoRepository

### Phase 4: Orchestration & Controller

#### 4.1 Create TodoCoordinator
**File:** `server/src/todos/coordinator/todo.coordinator.ts`
- Orchestrates complex flows
- Methods:
  - `createTodo(createTodoDto: CreateTodoDto): Todo`
  - `getTodos(): Todo[]`
  - `getTodoById(id: string): Todo | null`

#### 4.2 Create TodoController
**File:** `server/src/todos/todo.controller.ts`
- REST endpoints using Lauer pattern:
  - `POST /todos` → calls Coordinator → uses CreateTodoCommand
  - `GET /todos` → calls Coordinator → uses GetTodosQuery
  - `GET /todos/:id` → calls Coordinator
  - `PATCH /todos/:id` → calls Coordinator → uses UpdateTodoCommand (Phase 2)
  - `DELETE /todos/:id` → calls Coordinator → uses DeleteTodoCommand (Phase 2)

#### 4.3 Create TodoModule
**File:** `server/src/todos/todo.module.ts`
- Import required providers
- Export TodoController
- Provide: TodoRepository, TodoDataSource, TodoCoordinator, GetTodosQuery, CreateTodoCommand

#### 4.4 Update AppModule
**File:** `server/src/app.module.ts`
- Import TodoModule

---

## Frontend (React)

### Phase 1: Components Structure

#### 1.1 Create TodoForm Component
**File:** `client/src/components/TodoForm.tsx`
- Form to create new TODO
- Inputs:
  - `title` (text input, required)
  - `description` (textarea, optional)
- Validation before submit
- Button to submit
- Clear form after successful submit

#### 1.2 Create TodoItem Component
**File:** `client/src/components/TodoItem.tsx`
- Display single TODO
- Show:
  - Title
  - Description (if exists)
  - Completed status (checkbox or button)
- Delete button (optional for phase 1)

#### 1.3 Create TodoList Component
**File:** `client/src/components/TodoList.tsx`
- Display list of all TODOs
- Map through todos and render TodoItem
- Empty state message if no TODOs

### Phase 2: Update App Component
**File:** `client/src/App.tsx`
- Remove counter and hero content (refactor to focus on TODOs)
- Add TodoForm component
- Add TodoList component
- State management:
  - `todos`: TODO[]
  - `loading`: boolean
  - `error`: string | null

### Phase 3: API Integration

#### 3.1 Create API Service
**File:** `client/src/services/todoService.ts`
- Functions:
  - `getTodos()`: Fetch all TODOs
  - `createTodo(title, description)`: Create TODO
  - `updateTodo(id, updates)`: Update TODO
  - `deleteTodo(id)`: Delete TODO
- Handle errors gracefully

#### 3.2 Connect Components to API
- `TodoForm` calls `createTodo()` on submit
- `App` fetches TODOs on mount (`useEffect`)
- `TodoItem` handles delete/update actions
- Show loading/error states

---

## Integration Points

### API Communication
**Backend URL:** `http://localhost:3000`
- CORS should work with default NestJS config
- All requests from `http://localhost:5173` (Vite dev server)

### Data Flow
1. Frontend loads → Fetch all TODOs
2. User submits form → POST to backend
3. Backend creates TODO → Returns new TODO
4. Frontend adds to list → UI updates
5. User can edit/delete (Phase 2)

---

## Testing Strategy

### Backend
- Unit tests for Todo domain (constructor validation)
- Unit tests for GetTodosQuery and CreateTodoCommand
- E2E tests for TodoController (API endpoints)
- Test: Valid TODO creation
- Test: Invalid title (empty, too long)
- Test: Optional description handling

### Frontend
- Component tests for TodoForm, TodoItem, TodoList
- Integration test: Add TODO flow end-to-end
- Test API error handling and loading states

---

## Files to Create

### Backend
```
server/src/todos/
├── todo.module.ts
├── todo.controller.ts
├── todo.controller.spec.ts
├── domain/
│   ├── todo.ts               # Domain class (immutable, self-validating)
│   ├── todo-id.ts           # Value domain for TodoId
│   └── todo-title.ts        # Value domain for TodoTitle
├── dto/
│   ├── create-todo.dto.ts
│   └── todo.response.dto.ts
├── datasource/
│   └── todo.datasource.ts   # In-memory storage
├── repository/
│   └── todo.repository.ts
├── query/
│   ├── get-todos.query.ts
│   └── get-todo-by-id.query.ts
├── command/
│   ├── create-todo.command.ts
│   └── create-todo.command.spec.ts
└── coordinator/
    └── todo.coordinator.ts
```

### Frontend
```
client/src/
├── components/
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   └── TodoList.tsx
├── services/
│   └── todoService.ts
└── types/
    └── todo.ts
```

---

## Acceptance Criteria

| Scenario | Given | When | Then |
| :--- | :--- | :--- | :--- |
| **Create TODO with valid title** | I am on the Todo App dashboard | I enter "Buy milk" in the title input and click "Add TODO" button | A new todo item "Buy milk" should appear in the list immediately, and the form should be cleared |
| **Prevent empty TODO creation** | I am on the Todo App dashboard | I click "Add TODO" button without entering a title | No new todo item should be created, and I should see a validation error message "Title is required" |
| **Display all TODOs on load** | I have previously created todos: "Buy milk", "Pay bills" | I navigate to the Todo App dashboard (refresh the page) | Both "Buy milk" and "Pay bills" should appear in the list |
| **TODO creation with optional description** | I am on the Todo App dashboard | I enter "Buy groceries" as title and "Need eggs and milk" as description, then click "Add TODO" | The todo item should appear with both title and description visible in the list |
| **Empty list state** | The backend has no todos | I navigate to the Todo App dashboard | I should see a message like "No todos yet. Create one to get started" |
| **API error handling** | The backend is unavailable (returns 500 error) | I try to create a new todo | I should see an error message "Failed to create todo. Please try again" and the form should remain populated |
| **Backend validates title length** | I am using the backend API directly | I send a POST request with a title longer than 255 characters | The server should return HTTP 400 with error "Title must not exceed 255 characters" |
| **Backend validates empty title** | I am using the backend API directly | I send a POST request with an empty title | The server should return HTTP 400 with error "Title is required" |

---

## Out of Scope (This Plan)

- Database integration (using in-memory storage for Phase 1)
- Edit TODO functionality
- Mark TODO as complete/incomplete
- Delete TODO functionality
- Filter/search functionality
- User authentication
- Multi-user support
- Persistence across server restarts
- TODO categories/tags
- Due dates and priority levels
- Soft deletes or archival

## Future Enhancements (Phase 2+)
- [ ] Database integration (PostgreSQL, MongoDB, etc.)
- [ ] Edit TODO functionality
- [ ] Mark TODO as complete/incomplete
- [ ] Delete TODO
- [ ] Filter by status (all/completed/pending)
- [ ] User authentication
- [ ] Multi-user support
- [ ] TODO categories/tags
- [ ] Due dates
- [ ] Priority levels
