import { LabelId } from "@/todos/domain/label-id";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export class Label {
  private constructor(
    private readonly _id: LabelId,
    private readonly _name: string,
    private readonly _color: string,
  ) {
    if (!_name || _name.trim().length === 0) {
      throw new Error("Label name must not be empty");
    }
    if (_name.length > 100) {
      throw new Error("Label name must be no longer than 100 characters");
    }
    if (!HEX_COLOR_PATTERN.test(_color)) {
      throw new Error("Label color must be a valid hex color (e.g. #FF5733)");
    }
  }

  static create(name: string, color: string): Label {
    const id = LabelId.create();
    return new Label(id, name, color);
  }

  static reconstruct(id: string, name: string, color: string): Label {
    const labelId = LabelId.of(id);
    return new Label(labelId, name, color);
  }

  id(): LabelId {
    return this._id;
  }

  name(): string {
    return this._name;
  }

  color(): string {
    return this._color;
  }
}
