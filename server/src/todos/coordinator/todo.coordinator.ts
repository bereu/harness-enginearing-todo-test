import { Injectable } from '@nestjs/common';
import { Todo, TodoStatus } from '@/todos/domain/todo';
import { TodosList } from '@/todos/domain/todos-list';
import { TodoId } from '@/todos/domain/todo-id';
import { CreateTodoDto } from '@/todos/dto/create-todo.dto';
import { UpdateTodoDto } from '@/todos/dto/update-todo.dto';
import { GetTodosQuery } from '@/todos/query/get-todos.query';
import { GetTodoByIdQuery } from '@/todos/query/get-todo-by-id.query';
import { CreateTodoCommand } from '@/todos/command/create-todo.command';
import { UpdateTodoCommand } from '@/todos/command/update-todo.command';
import { TodoRepository } from '@/todos/repository/todo.repository';

@Injectable()
export class TodoCoordinator {
  constructor(
    private readonly getTodosQuery: GetTodosQuery,
    private readonly getTodoByIdQuery: GetTodoByIdQuery,
    private readonly createTodoCommand: CreateTodoCommand,
    private readonly updateTodoCommand: UpdateTodoCommand,
    private readonly todoRepository: TodoRepository,
  ) {}

  createTodo(createTodoDto: CreateTodoDto): Todo {
    return this.createTodoCommand.execute(
      createTodoDto.title,
      createTodoDto.description,
      createTodoDto.status as TodoStatus | undefined,
    );
  }

  getTodos(): TodosList {
    return this.getTodosQuery.execute();
  }

  getTodoById(id: string): Todo | null {
    try {
      const todoId = TodoId.of(id);
      return this.getTodoByIdQuery.execute(todoId);
    } catch {
      return null;
    }
  }

  updateTodo(id: string, updateTodoDto: UpdateTodoDto): Todo | null {
    return this.updateTodoCommand.execute(
      id,
      updateTodoDto.title,
      updateTodoDto.description,
      updateTodoDto.completed,
      updateTodoDto.status as TodoStatus | undefined,
    );
  }

  getTodosByStatus(status: string): Todo[] {
    return this.todoRepository.findByStatus(status);
  }
}
