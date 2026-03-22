import { Module } from "@nestjs/common";
import { TodoController } from "@/todos/todo.controller";
import { GetTodosQuery } from "@/todos/query/get-todos.query";
import { GetTodoByIdQuery } from "@/todos/query/get-todo-by-id.query";
import { GetTodosByStatusQuery } from "@/todos/query/get-todos-by-status.query";
import { GetLabelsQuery } from "@/todos/query/get-labels.query";
import { GetLabelsForTodoQuery } from "@/todos/query/get-labels-for-todo.query";
import { CreateTodoCommand } from "@/todos/command/create-todo.command";
import { UpdateTodoCommand } from "@/todos/command/update-todo.command";
import { CreateLabelCommand } from "@/todos/command/create-label.command";
import { SetLabelsForTodoCommand } from "@/todos/command/set-labels-for-todo.command";
import { TodoRepository } from "@/todos/repository/todo.repository";
import { TodoDataSource } from "@/todos/datasource/todo.datasource";
import { LabelRepository } from "@/todos/repository/label.repository";
import { LabelDataSource } from "@/todos/datasource/label.datasource";
import { TodoLabelDataSource } from "@/todos/datasource/todo-label.datasource";
import { TodoLabelRepository } from "@/todos/repository/todo-label.repository";

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
    LabelDataSource,
    LabelRepository,
    GetLabelsQuery,
    CreateLabelCommand,
    TodoLabelDataSource,
    TodoLabelRepository,
    GetLabelsForTodoQuery,
    SetLabelsForTodoCommand,
  ],
})
export class TodoModule {}
