export class HelloMessage {
  private constructor(private readonly _value: string) {
    if (!_value || typeof _value !== "string") {
      throw new Error("HelloMessage must be a non-empty string");
    }
  }

  static create(message: string): HelloMessage {
    return new HelloMessage(message);
  }

  value(): string {
    return this._value;
  }
}
