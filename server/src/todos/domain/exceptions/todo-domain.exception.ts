export class TodoDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TodoDomainException";
  }
}

export class InvalidTodoTitleException extends TodoDomainException {
  constructor(reason: string) {
    super(`Invalid todo title: ${reason}`);
    this.name = "InvalidTodoTitleException";
  }
}

export class InvalidTodoIdException extends TodoDomainException {
  constructor(reason: string) {
    super(`Invalid todo id: ${reason}`);
    this.name = "InvalidTodoIdException";
  }
}
