import { Injectable } from '@nestjs/common';
import { Todo, TodoStatus } from '@/todos/domain/todo';
import { TodoRepository } from '@/todos/repository/todo.repository';

@Injectable()
export class CreateTodoCommand {
  constructor(private readonly repository: TodoRepository) {}

  execute(
    title: string,
    description?: string | null,
    status?: TodoStatus,
  ): Todo {
    const todo = Todo.create(title, description, undefined, status);
    this.repository.add(todo);
    return todo;
  }
}
