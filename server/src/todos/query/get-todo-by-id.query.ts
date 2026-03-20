import { Injectable } from '@nestjs/common';
import { Todo } from '@/todos/domain/todo';
import { TodoId } from '@/todos/domain/todo-id';
import { TodoRepository } from '@/todos/repository/todo.repository';

@Injectable()
export class GetTodoByIdQuery {
  constructor(private readonly repository: TodoRepository) {}

  execute(id: TodoId): Todo | null {
    return this.repository.getById(id);
  }
}
