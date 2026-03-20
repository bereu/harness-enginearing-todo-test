import { Injectable } from '@nestjs/common';
import { TodosList } from '@/todos/domain/todos-list';
import { TodoRepository } from '@/todos/repository/todo.repository';

@Injectable()
export class GetTodosByStatusQuery {
  constructor(private readonly repository: TodoRepository) {}

  execute(status: string): TodosList {
    const todos = this.repository.findByStatus(status);
    return TodosList.create(todos);
  }
}
