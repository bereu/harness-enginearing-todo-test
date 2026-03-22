import { Injectable } from "@nestjs/common";
import { Todo, TodoStatus } from "@/todos/domain/todo";
import { TodoId } from "@/todos/domain/todo-id";
import { TodoRepository } from "@/todos/repository/todo.repository";
import { SetLabelsForTodoCommand } from "@/todos/command/set-labels-for-todo.command";

@Injectable()
export class UpdateTodoCommand {
  constructor(
    private readonly repository: TodoRepository,
    private readonly setLabelsForTodoCommand: SetLabelsForTodoCommand,
  ) {}

  execute(
    id: string,
    title?: string,
    description?: string | null,
    completed?: boolean,
    status?: TodoStatus,
    labelIds?: string[],
  ): Todo | null {
    const todoId = TodoId.of(id);
    let todo = this.repository.getById(todoId);

    if (!todo) {
      return null;
    }

    if (title !== undefined) {
      todo = todo.withTitle(title);
    }

    if (description !== undefined) {
      todo = todo.withDescription(description);
    }

    if (completed !== undefined) {
      todo = completed ? todo.asCompleted() : todo.asPending();
    }

    if (status !== undefined) {
      todo = todo.withStatus(status);
    }

    this.repository.update(todo);

    if (labelIds !== undefined) {
      this.setLabelsForTodoCommand.execute(id, labelIds);
    }

    return todo;
  }
}
