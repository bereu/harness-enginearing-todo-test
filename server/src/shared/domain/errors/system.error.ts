export class SystemError extends Error {
  constructor(
    message: string,
    readonly statusCode: number = 500,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'SystemError';
    Object.setPrototypeOf(this, SystemError.prototype);
  }
}
