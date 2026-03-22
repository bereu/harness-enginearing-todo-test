import { Injectable } from "@nestjs/common";
import { TodoLabelRepository } from "@/todos/repository/todo-label.repository";
import { LabelRepository } from "@/todos/repository/label.repository";
import { BusinessLogicError } from "@/shared/domain/errors/business-logic.error";

@Injectable()
export class SetLabelsForTodoCommand {
  constructor(
    private readonly todoLabelRepository: TodoLabelRepository,
    private readonly labelRepository: LabelRepository,
  ) {}

  execute(todoId: string, labelIds: string[]): void {
    const allLabels = this.labelRepository.findAll();
    for (const labelId of labelIds) {
      const label = allLabels.findById(labelId);
      if (!label) {
        throw new BusinessLogicError(`Label with id "${labelId}" not found`);
      }
    }
    this.todoLabelRepository.setLabels(todoId, labelIds);
  }
}
