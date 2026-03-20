import { Todo } from '@/todos/domain/todo';

export class TodosList {
  private constructor(private readonly list: Todo[]) {
    if (!Array.isArray(list)) {
      throw new Error('TodosList must be initialized with an array');
    }
  }

  static create(todos: Todo[]): TodosList {
    return new TodosList(todos);
  }

  static empty(): TodosList {
    return new TodosList([]);
  }

  // Accessors
  getAll(): Todo[] {
    return [...this.list];
  }

  getCount(): number {
    return this.list.length;
  }

  isEmpty(): boolean {
    return this.list.length === 0;
  }

  // Derivation: Filter completed todos
  filterCompleted(): TodosList {
    return new TodosList(this.list.filter((todo) => todo.completed()));
  }

  // Derivation: Filter pending todos
  filterPending(): TodosList {
    return new TodosList(this.list.filter((todo) => !todo.completed()));
  }

  // Derivation: Get single todo by id or null
  findById(id: string): Todo | null {
    const found = this.list.find((todo) => todo.id().value() === id);
    return found || null;
  }

  // Derivation: Add todo and return new list
  add(todo: Todo): TodosList {
    return new TodosList([...this.list, todo]);
  }

  // Derivation: Remove todo by id and return new list
  remove(id: string): TodosList {
    return new TodosList(this.list.filter((todo) => todo.id().value() !== id));
  }

  // Derivation: Update todo and return new list
  update(updatedTodo: Todo): TodosList {
    return new TodosList(
      this.list.map((todo) =>
        todo.id().equals(updatedTodo.id()) ? updatedTodo : todo,
      ),
    );
  }
}
