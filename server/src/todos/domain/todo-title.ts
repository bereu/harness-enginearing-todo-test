import { InvalidTodoTitleException } from "@/todos/domain/exceptions/todo-domain.exception";

export class TodoTitle {
  private constructor(private readonly _value: string) {}

  static create(title: string): TodoTitle {
    if (!title || typeof title !== "string") {
      throw new InvalidTodoTitleException("must be a non-empty string");
    }

    const trimmed = title.trim();
    if (trimmed.length === 0) {
      throw new InvalidTodoTitleException("must not be empty after trimming");
    }

    if (trimmed.length > 255) {
      throw new InvalidTodoTitleException(`must not exceed 255 characters (got ${trimmed.length})`);
    }

    return new TodoTitle(trimmed);
  }

  value(): string {
    return this._value;
  }

  equals(other: TodoTitle): boolean {
    return this._value === other._value;
  }
}
