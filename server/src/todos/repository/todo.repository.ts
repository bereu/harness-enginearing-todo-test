import { Injectable } from '@nestjs/common';
import { Todo, TodoStatus } from '@/todos/domain/todo';
import { TodoId } from '@/todos/domain/todo-id';
import {
  TodoDataSource,
  TodoDataSourceModel,
} from '@/todos/datasource/todo.datasource';

@Injectable()
export class TodoRepository {
  constructor(private readonly datasource: TodoDataSource) {}

  add(todo: Todo): void {
    const model: TodoDataSourceModel = {
      id: todo.id().value(),
      title: todo.title().value(),
      description: todo.description(),
      completed: todo.completed(),
      createdAt: todo.createdAt(),
      status: todo.status(),
    };
    this.datasource.save(model);
  }

  getAll(): Todo[] {
    const models = this.datasource.findAll();
    return models.map((model) =>
      Todo.reconstruct(
        model.id,
        model.title,
        model.description,
        model.completed,
        model.createdAt,
        model.status as TodoStatus,
      ),
    );
  }

  getById(id: TodoId): Todo | null {
    const model = this.datasource.findById(id.value());
    if (!model) {
      return null;
    }
    return Todo.reconstruct(
      model.id,
      model.title,
      model.description,
      model.completed,
      model.createdAt,
      model.status as TodoStatus,
    );
  }

  findById(id: TodoId): Todo | null {
    return this.getById(id);
  }

  update(todo: Todo): void {
    const model: TodoDataSourceModel = {
      id: todo.id().value(),
      title: todo.title().value(),
      description: todo.description(),
      completed: todo.completed(),
      createdAt: todo.createdAt(),
      status: todo.status(),
    };
    this.datasource.save(model);
  }

  findByStatus(status: string): Todo[] {
    const models = this.datasource.findAll();
    return models
      .filter((model) => model.status === status)
      .map((model) =>
        Todo.reconstruct(
          model.id,
          model.title,
          model.description,
          model.completed,
          model.createdAt,
          model.status as TodoStatus,
        ),
      );
  }

  remove(id: TodoId): void {
    this.datasource.delete(id.value());
  }
}
