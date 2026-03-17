import { randomUUID } from 'crypto';
import { InvalidTodoIdException } from '@/todos/domain/exceptions/todo-domain.exception';

export class TodoId {
  private constructor(private readonly _value: string) {}

  static create(id?: string): TodoId {
    const uuid = id || randomUUID();
    return new TodoId(uuid);
  }

  static of(id: string): TodoId {
    if (!id || typeof id !== 'string') {
      throw new InvalidTodoIdException('must be a non-empty string');
    }
    return new TodoId(id);
  }

  value(): string {
    return this._value;
  }

  equals(other: TodoId): boolean {
    return this._value === other._value;
  }
}
