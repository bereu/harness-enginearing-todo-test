import { Injectable } from "@nestjs/common";

@Injectable()
export class TodoLabelDataSource {
  private readonly data = new Map<string, Set<string>>();

  setLabels(todoId: string, labelIds: string[]): void {
    this.data.set(todoId, new Set(labelIds));
  }

  getLabelIds(todoId: string): string[] {
    return Array.from(this.data.get(todoId) ?? []);
  }
}
