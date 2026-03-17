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
} from '@nestjs/common';
import { CreateTodoDto } from '@/todos/dto/create-todo.dto';
import { UpdateTodoDto } from '@/todos/dto/update-todo.dto';
import { TodoResponseDto } from '@/todos/dto/todo.response.dto';
import { TodoCoordinator } from '@/todos/coordinator/todo.coordinator';
import { Todo } from '@/todos/domain/todo';

@Controller('todos')
export class TodoController {
  constructor(private readonly coordinator: TodoCoordinator) {}

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto): TodoResponseDto {
    try {
      const todo = this.coordinator.createTodo(createTodoDto);
      return this.mapTodoToResponseDto(todo);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create todo',
      );
    }
  }

  @Get()
  getTodos(@Query('status') status?: string): TodoResponseDto[] {
    if (status) {
      const todos = this.coordinator.getTodosByStatus(status);
      return todos.map((todo) => this.mapTodoToResponseDto(todo));
    }
    const todosList = this.coordinator.getTodos();
    return todosList.getAll().map((todo) => this.mapTodoToResponseDto(todo));
  }

  @Get(':id')
  getTodoById(@Param('id') id: string): TodoResponseDto {
    const todo = this.coordinator.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return this.mapTodoToResponseDto(todo);
  }

  @Patch(':id')
  updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): TodoResponseDto {
    try {
      const todo = this.coordinator.updateTodo(id, updateTodoDto);
      if (!todo) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      return this.mapTodoToResponseDto(todo);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update todo',
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
