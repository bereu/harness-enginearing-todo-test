import { Test, TestingModule } from "@nestjs/testing";
import { CreateTodoCommand } from "@/todos/command/create-todo.command";
import { TodoRepository } from "@/todos/repository/todo.repository";
import { Todo } from "@/todos/domain/todo";

describe("CreateTodoCommand", () => {
  let command: CreateTodoCommand;
  let repository: TodoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTodoCommand,
        {
          provide: TodoRepository,
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<CreateTodoCommand>(CreateTodoCommand);
    repository = module.get<TodoRepository>(TodoRepository);
  });

  describe("execute", () => {
    it("should create a todo with title only", () => {
      // Arrange
      jest.spyOn(repository, "add").mockReturnValue(undefined);

      // Act
      const result = command.execute("My Todo", undefined);

      // Assert
      expect(result).toBeInstanceOf(Todo);
      expect(result.title().value()).toBe("My Todo");
      expect(result.description()).toBeNull();
      expect(result.completed()).toBe(false);
      expect(result.status()).toBe("todo");
      expect(repository.add).toHaveBeenCalledWith(result);
    });

    it("should create a todo with title and description", () => {
      // Arrange
      jest.spyOn(repository, "add").mockReturnValue(undefined);

      // Act
      const result = command.execute("My Todo", "This is a description");

      // Assert
      expect(result.title().value()).toBe("My Todo");
      expect(result.description()).toBe("This is a description");
      expect(result.completed()).toBe(false);
      expect(repository.add).toHaveBeenCalledWith(result);
    });

    it("should throw error when title is empty", () => {
      // Act & Assert
      expect(() => command.execute("", undefined)).toThrow();
      expect(repository.add).not.toHaveBeenCalled();
    });

    it("should throw error when title exceeds max length", () => {
      // Arrange
      const tooLongTitle = "a".repeat(256);

      // Act & Assert
      expect(() => command.execute(tooLongTitle, undefined)).toThrow();
      expect(repository.add).not.toHaveBeenCalled();
    });

    it("should create immutable domain object", () => {
      // Arrange
      jest.spyOn(repository, "add").mockReturnValue(undefined);

      // Act
      const result = command.execute("Original Title", "Description");
      const modified = result.withTitle("Modified Title");

      // Assert
      expect(result.title().value()).toBe("Original Title");
      expect(modified.title().value()).toBe("Modified Title");
      expect(result).not.toBe(modified);
    });
  });
});
