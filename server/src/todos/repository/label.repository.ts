import { Injectable } from "@nestjs/common";
import { Label } from "@/todos/domain/label";
import { LabelsList } from "@/todos/domain/labels-list";
import { LabelDataSource, LabelDataSourceModel } from "@/todos/datasource/label.datasource";

@Injectable()
export class LabelRepository {
  constructor(private readonly datasource: LabelDataSource) {}

  findAll(): LabelsList {
    const models = this.datasource.findAll();
    const labels = models.map((model) => Label.reconstruct(model.id, model.name, model.color));
    return LabelsList.create(labels);
  }

  save(label: Label): void {
    const model: LabelDataSourceModel = {
      id: label.id().value(),
      name: label.name(),
      color: label.color(),
    };
    this.datasource.save(model);
  }

  findByName(name: string): Label | null {
    const models = this.datasource.findAll();
    const found = models.find((m) => m.name === name);
    if (!found) return null;
    return Label.reconstruct(found.id, found.name, found.color);
  }
}
