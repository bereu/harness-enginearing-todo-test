import { TodoId } from "@/todos/domain/todo-id";
import { TodoTitle } from "@/todos/domain/todo-title";

export const VALID_STATUSES = ["todo", "in-progress", "done"] as const;
export type TodoStatus = (typeof VALID_STATUSES)[number];

const DEFAULT_STATUS: TodoStatus = "todo";

export class Todo {
  private constructor(
    private readonly _id: TodoId,
    private readonly _title: TodoTitle,
    private readonly _description: string | null,
    private readonly _completed: boolean,
    private readonly _createdAt: Date,
    private readonly _status: TodoStatus,
  ) {}

  static create(
    title: string,
    description?: string | null,
    id?: string,
    status?: TodoStatus,
  ): Todo {
    const todoId = TodoId.create(id);
    const todoTitle = TodoTitle.create(title);
    const validatedStatus = this.validateStatus(status || DEFAULT_STATUS);

    return new Todo(todoId, todoTitle, description || null, false, new Date(), validatedStatus);
  }

  static reconstruct(
    id: string,
    title: string,
    description: string | null,
    completed: boolean,
    createdAt: Date,
    status?: TodoStatus,
  ): Todo {
    const todoId = TodoId.of(id);
    const todoTitle = TodoTitle.create(title);
    const validatedStatus = this.validateStatus(status || DEFAULT_STATUS);

    return new Todo(todoId, todoTitle, description, completed, createdAt, validatedStatus);
  }

  id(): TodoId {
    return this._id;
  }

  title(): TodoTitle {
    return this._title;
  }

  description(): string | null {
    return this._description;
  }

  completed(): boolean {
    return this._completed;
  }

  createdAt(): Date {
    return this._createdAt;
  }

  status(): TodoStatus {
    return this._status;
  }

  // Derivation: Create new immutable instance with updated title
  withTitle(newTitle: string): Todo {
    const todoTitle = TodoTitle.create(newTitle);
    return new Todo(
      this._id,
      todoTitle,
      this._description,
      this._completed,
      this._createdAt,
      this._status,
    );
  }

  // Derivation: Create new immutable instance with updated description
  withDescription(newDescription: string | null): Todo {
    return new Todo(
      this._id,
      this._title,
      newDescription || null,
      this._completed,
      this._createdAt,
      this._status,
    );
  }

  // Derivation: Create new immutable instance as completed
  asCompleted(): Todo {
    return new Todo(this._id, this._title, this._description, true, this._createdAt, this._status);
  }

  // Derivation: Create new immutable instance as pending
  asPending(): Todo {
    return new Todo(this._id, this._title, this._description, false, this._createdAt, this._status);
  }

  // Derivation: Create new immutable instance with updated status
  withStatus(newStatus: TodoStatus): Todo {
    const validatedStatus = Todo.validateStatus(newStatus);
    return new Todo(
      this._id,
      this._title,
      this._description,
      this._completed,
      this._createdAt,
      validatedStatus,
    );
  }

  private static validateStatus(status: string): TodoStatus {
    if (!VALID_STATUSES.includes(status as TodoStatus)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    return status as TodoStatus;
  }
}
