import { Injectable } from "@nestjs/common";

export interface LabelDataSourceModel {
  id: string;
  name: string;
  color: string;
}

@Injectable()
export class LabelDataSource {
  private labels: LabelDataSourceModel[] = [];

  save(model: LabelDataSourceModel): void {
    const index = this.labels.findIndex((l) => l.id === model.id);
    if (index >= 0) {
      this.labels[index] = model;
    } else {
      this.labels.push(model);
    }
  }

  findAll(): LabelDataSourceModel[] {
    return [...this.labels];
  }

  findById(id: string): LabelDataSourceModel | null {
    return this.labels.find((l) => l.id === id) || null;
  }
}
