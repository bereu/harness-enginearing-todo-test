import { randomUUID } from "crypto";

export class Status {
  private constructor(
    private readonly _id: string,
    private readonly _label: string,
    private readonly _slug: string,
  ) {}

  static create(label: string): Status {
    const trimmedLabel = label.trim();
    Status.validateLabel(trimmedLabel);
    const slug = Status.generateSlug(trimmedLabel);
    return new Status(randomUUID(), trimmedLabel, slug);
  }

  static reconstruct(id: string, label: string, slug: string): Status {
    Status.validateLabel(label);
    Status.validateSlug(slug);
    return new Status(id, label, slug);
  }

  id(): string {
    return this._id;
  }

  label(): string {
    return this._label;
  }

  slug(): string {
    return this._slug;
  }

  private static validateLabel(label: string): void {
    if (!label || label.length === 0) {
      throw new Error("Status label must not be empty");
    }
    if (label.length > 50) {
      throw new Error("Status label must be no longer than 50 characters");
    }
  }

  private static validateSlug(slug: string): void {
    if (!slug || slug.length === 0) {
      throw new Error("Status slug must not be empty");
    }
    if (slug.length > 50) {
      throw new Error("Status slug must be no longer than 50 characters");
    }
  }

  static generateSlug(label: string): string {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
