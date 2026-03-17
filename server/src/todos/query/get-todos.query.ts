import { Injectable } from '@nestjs/common';
import { TodosList } from '@/todos/domain/todos-list';
import { TodoRepository } from '@/todos/repository/todo.repository';

@Injectable()
export class GetTodosQuery {
  constructor(private readonly repository: TodoRepository) {}

  execute(): TodosList {
    const todos = this.repository.getAll();
    return TodosList.create(todos);
  }
}
