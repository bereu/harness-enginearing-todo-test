# Todo Domain Structure

## Domain Entities & Value Objects

### TodoId (Value Object)

**Location:** `server/src/todos/domain/todo-id.ts`

**Responsibilities:**

- Encapsulate unique todo identifier
- Validate ID format

**Methods:**

- `static create(id?: string): TodoId` - Create new ID (generates UUID if not provided)
- `static of(id: string): TodoId` - Create from existing ID with validation
- `value(): string` - Get string value
- `equals(other: TodoId): boolean` - Compare IDs

**Exceptions:**

- `InvalidTodoIdException` - Thrown when ID validation fails

---

### TodoTitle (Value Object)

**Location:** `server/src/todos/domain/todo-title.ts`

**Responsibilities:**

- Encapsulate todo title with business validation
- Enforce title length and non-empty rules

**Business Rules:**

- Title must be non-empty string
- Title must not be empty after trimming whitespace
- Title must not exceed 255 characters

**Methods:**

- `static create(title: string): TodoTitle` - Create with validation
- `value(): string` - Get string value
- `equals(other: TodoTitle): boolean` - Compare titles

**Exceptions:**

- `InvalidTodoTitleException` - Thrown when validation fails

---

### Todo (Aggregate Root - Value Domain)

**Location:** `server/src/todos/domain/todo.ts`

**Responsibilities:**

- Aggregate root for todo entities
- Encapsulate all todo state (immutable)
- Enforce invariants across all properties
- Provide derivation methods for state transitions

**Properties:**

- `_id: TodoId` - Unique identifier
- `_title: TodoTitle` - Title value object
- `_description: string | null` - Optional description
- `_completed: boolean` - Completion status
- `_createdAt: Date` - Creation timestamp (immutable)

**Factory Methods:**

- `static create(title: string, description?: string | null, id?: string): Todo` - Create new todo
- `static reconstruct(...): Todo` - Reconstruct from persistence

**Accessors (Getters Only):**

- `id(): TodoId` - Get todo ID
- `title(): TodoTitle` - Get todo title
- `description(): string | null` - Get description
- `completed(): boolean` - Check completion status
- `createdAt(): Date` - Get creation timestamp

**Derivation Methods (Immutable):**

- `withTitle(newTitle: string): Todo` - Return new Todo with updated title
- `withDescription(newDescription: string | null): Todo` - Return new Todo with updated description
- `asCompleted(): Todo` - Return new Todo marked as complete
- `asPending(): Todo` - Return new Todo marked as pending

---

### TodosList (List Domain)

**Location:** `server/src/todos/domain/todos-list.ts`

**Responsibilities:**

- Wrap collection of Todo domain objects
- Provide list-wide business logic and filtering
- Return domain objects to clients (not DTOs)

**Properties:**

- `list: Todo[]` - Immutable array of Todo objects

**Factory Methods:**

- `static create(todos: Todo[]): TodosList` - Create from array
- `static empty(): TodosList` - Create empty list

**Accessors:**

- `getAll(): Todo[]` - Get all todos
- `getCount(): number` - Get count of todos
- `isEmpty(): boolean` - Check if list is empty

**Derivation Methods (Return New TodosList):**

- `filterCompleted(): TodosList` - Get only completed todos
- `filterPending(): TodosList` - Get only pending todos
- `findById(id: string): Todo | null` - Find single todo
- `add(todo: Todo): TodosList` - Add todo and return new list
- `remove(id: string): TodosList` - Remove todo and return new list
- `update(updatedTodo: Todo): TodosList` - Update todo and return new list

---

## Domain Exceptions

**Location:** `server/src/todos/domain/exceptions/todo-domain.exception.ts`

### TodoDomainException

Base exception for all todo domain errors.

### InvalidTodoTitleException

Thrown when title validation fails.

### InvalidTodoIdException

Thrown when ID validation fails.

---

## Architecture Compliance (BE-001)

✅ **Domain Layer Responsibilities:**

- Encapsulates business logic and validation
- Defines domain objects (value objects, aggregates)
- Enforces business rules through domain methods
- Throws domain-specific exceptions

✅ **Validation Strategy:**

- Value objects validate at creation time
- Aggregate performs state transitions safely
- Business rules are explicit in domain methods

✅ **Immutability:**

- Created/CreatedAt immutable
- Title/Description mutable only through domain methods
- All state accessed through domain accessors

---

## Usage Patterns

### Creating a Todo

```typescript
// From controller input
const todo = Todo.create(createTodoDto.title, createTodoDto.description);
```

### State Transitions (Immutable)

```typescript
// Domain derivation methods return new instances
const completedTodo = todo.asCompleted(); // New Todo with completed=true
const updatedTodo = todo.withTitle("New title"); // New Todo with new title
const newDescription = completedTodo.withDescription("Updated description");
```

### Working with TodosList

```typescript
// Get all todos as domain collection
const todosList = coordinator.getTodos(); // Returns TodosList

// Access todos or perform list operations
const allTodos = todosList.getAll();
const completedOnly = todosList.filterCompleted();
const singleTodo = todosList.findById("123");

// Create new lists from operations
const withNewTodo = todosList.add(newTodo);
const afterRemoval = withNewTodo.remove("456");
```

### Returning to Client

```typescript
// Controller maps domain to DTO for HTTP response
const todosList = coordinator.getTodos();
return todosList.getAll().map((todo) => this.mapTodoToResponseDto(todo));
```
