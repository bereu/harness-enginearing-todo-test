import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateTodoDto } from "@/todos/dto/create-todo.dto";
import { UpdateTodoDto } from "@/todos/dto/update-todo.dto";
import { TodoResponseDto } from "@/todos/dto/todo.response.dto";
import { GetTodosQuery } from "@/todos/query/get-todos.query";
import { GetTodoByIdQuery } from "@/todos/query/get-todo-by-id.query";
import { GetTodosByStatusQuery } from "@/todos/query/get-todos-by-status.query";
import { CreateTodoCommand } from "@/todos/command/create-todo.command";
import { UpdateTodoCommand } from "@/todos/command/update-todo.command";
import { Todo, TodoStatus } from "@/todos/domain/todo";
import { TodoId } from "@/todos/domain/todo-id";

@Controller("todos")
export class TodoController {
  constructor(
    private readonly getTodosQuery: GetTodosQuery,
    private readonly getTodoByIdQuery: GetTodoByIdQuery,
    private readonly getTodosByStatusQuery: GetTodosByStatusQuery,
    private readonly createTodoCommand: CreateTodoCommand,
    private readonly updateTodoCommand: UpdateTodoCommand,
  ) {}

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto): TodoResponseDto {
    try {
      const todo = this.createTodoCommand.execute(
        createTodoDto.title,
        createTodoDto.description,
        createTodoDto.status as TodoStatus | undefined,
      );
      return this.mapTodoToResponseDto(todo);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Failed to create todo",
      );
    }
  }

  @Get()
  getTodos(@Query("status") status?: string): TodoResponseDto[] {
    if (status) {
      const todosList = this.getTodosByStatusQuery.execute(status);
      return todosList.getAll().map((todo) => this.mapTodoToResponseDto(todo));
    }
    const todosList = this.getTodosQuery.execute();
    return todosList.getAll().map((todo) => this.mapTodoToResponseDto(todo));
  }

  @Get(":id")
  getTodoById(@Param("id") id: string): TodoResponseDto {
    try {
      const todoId = TodoId.of(id);
      const todo = this.getTodoByIdQuery.execute(todoId);
      if (!todo) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      return this.mapTodoToResponseDto(todo);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error instanceof Error ? error.message : "Invalid todo ID");
    }
  }

  @Patch(":id")
  updateTodo(@Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto): TodoResponseDto {
    try {
      const todo = this.updateTodoCommand.execute(
        id,
        updateTodoDto.title,
        updateTodoDto.description,
        updateTodoDto.completed,
        updateTodoDto.status as TodoStatus | undefined,
      );
      if (!todo) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      return this.mapTodoToResponseDto(todo);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : "Failed to update todo",
      );
    }
  }

  private mapTodoToResponseDto(todo: Todo): TodoResponseDto {
    return new TodoResponseDto(
      todo.id().value(),
      todo.title().value(),
      todo.description(),
      todo.completed(),
      todo.createdAt(),
      todo.status(),
    );
  }
}
