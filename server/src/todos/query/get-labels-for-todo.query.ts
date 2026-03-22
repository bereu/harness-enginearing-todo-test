import { Injectable } from "@nestjs/common";
import { TodoLabelRepository } from "@/todos/repository/todo-label.repository";
import { LabelResponseDto } from "@/todos/dto/label.response.dto";

@Injectable()
export class GetLabelsForTodoQuery {
  constructor(private readonly todoLabelRepository: TodoLabelRepository) {}

  execute(todoId: string): LabelResponseDto[] {
    return this.todoLabelRepository
      .getLabelsForTodo(todoId)
      .map((label) => new LabelResponseDto(label.id().value(), label.name(), label.color()));
  }
}
