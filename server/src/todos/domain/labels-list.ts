import { Label } from "@/todos/domain/label";

export class LabelsList {
  private constructor(private readonly list: Label[]) {
    if (!Array.isArray(list)) {
      throw new Error("LabelsList must be initialized with an array");
    }
  }

  static create(labels: Label[]): LabelsList {
    return new LabelsList(labels);
  }

  static empty(): LabelsList {
    return new LabelsList([]);
  }

  getAll(): Label[] {
    return [...this.list];
  }

  findById(id: string): Label | null {
    const found = this.list.find((label) => label.id().value() === id);
    return found || null;
  }

  nameExists(name: string): boolean {
    return this.list.some((label) => label.name() === name);
  }

  add(label: Label): LabelsList {
    return new LabelsList([...this.list, label]);
  }
}
