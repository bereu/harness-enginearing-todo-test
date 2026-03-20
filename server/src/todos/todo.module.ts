import { Module } from "@nestjs/common";
import { TodoController } from "@/todos/todo.controller";
import { GetTodosQuery } from "@/todos/query/get-todos.query";
import { GetTodoByIdQuery } from "@/todos/query/get-todo-by-id.query";
import { GetTodosByStatusQuery } from "@/todos/query/get-todos-by-status.query";
import { CreateTodoCommand } from "@/todos/command/create-todo.command";
import { UpdateTodoCommand } from "@/todos/command/update-todo.command";
import { TodoRepository } from "@/todos/repository/todo.repository";
import { TodoDataSource } from "@/todos/datasource/todo.datasource";

@Module({
  controllers: [TodoController],
  providers: [
    TodoDataSource,
    TodoRepository,
    GetTodosQuery,
    GetTodoByIdQuery,
    GetTodosByStatusQuery,
    CreateTodoCommand,
    UpdateTodoCommand,
  ],
})
export class TodoModule {}
