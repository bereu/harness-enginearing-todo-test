import { Injectable } from "@nestjs/common";
import { Label } from "@/todos/domain/label";
import { TodoLabelDataSource } from "@/todos/datasource/todo-label.datasource";
import { LabelDataSource } from "@/todos/datasource/label.datasource";

@Injectable()
export class TodoLabelRepository {
  constructor(
    private readonly todoLabelDataSource: TodoLabelDataSource,
    private readonly labelDataSource: LabelDataSource,
  ) {}

  setLabels(todoId: string, labelIds: string[]): void {
    this.todoLabelDataSource.setLabels(todoId, labelIds);
  }

  getLabelsForTodo(todoId: string): Label[] {
    const labelIds = this.todoLabelDataSource.getLabelIds(todoId);
    return labelIds
      .map((id) => this.labelDataSource.findById(id))
      .filter((model): model is NonNullable<typeof model> => model !== null)
      .map((model) => Label.reconstruct(model.id, model.name, model.color));
  }
}
