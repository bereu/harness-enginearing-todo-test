import { Injectable } from '@nestjs/common';

export interface TodoDataSourceModel {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  status: string;
}

@Injectable()
export class TodoDataSource {
  private todos: TodoDataSourceModel[] = [];

  save(todo: TodoDataSourceModel): void {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index >= 0) {
      this.todos[index] = todo;
    } else {
      this.todos.push(todo);
    }
  }

  findAll(): TodoDataSourceModel[] {
    return [...this.todos];
  }

  findById(id: string): TodoDataSourceModel | null {
    return this.todos.find((t) => t.id === id) || null;
  }

  delete(id: string): void {
    this.todos = this.todos.filter((t) => t.id !== id);
  }
}
