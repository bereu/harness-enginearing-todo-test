import { randomUUID } from "crypto";

export class LabelId {
  private constructor(private readonly _value: string) {}

  static create(id?: string): LabelId {
    const uuid = id || randomUUID();
    return new LabelId(uuid);
  }

  static of(id: string): LabelId {
    if (!id || typeof id !== "string") {
      throw new Error("LabelId must be a non-empty string");
    }
    return new LabelId(id);
  }

  value(): string {
    return this._value;
  }

  equals(other: LabelId): boolean {
    return this._value === other._value;
  }
}
