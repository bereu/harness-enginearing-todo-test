import { Test, TestingModule } from "@nestjs/testing";
import { GetTodoByIdQuery } from "@/todos/query/get-todo-by-id.query";
import { TodoRepository } from "@/todos/repository/todo.repository";
import { Todo } from "@/todos/domain/todo";
import { TodoId } from "@/todos/domain/todo-id";

describe("GetTodoByIdQuery", () => {
  let query: GetTodoByIdQuery;
  let repository: TodoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTodoByIdQuery,
        {
          provide: TodoRepository,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    query = module.get<GetTodoByIdQuery>(GetTodoByIdQuery);
    repository = module.get<TodoRepository>(TodoRepository);
  });

  describe("execute", () => {
    it("should return a todo when it exists", () => {
      // Arrange
      const mockTodo = Todo.reconstruct("1", "Test Todo", "Test Description", false, new Date());
      const todoId = TodoId.of("1");
      jest.spyOn(repository, "getById").mockReturnValue(mockTodo);

      // Act
      const result = query.execute(todoId);

      // Assert
      expect(repository.getById).toHaveBeenCalledWith(todoId);
      expect(result).toBeInstanceOf(Todo);
      expect(result?.id().value()).toBe("1");
      expect(result?.title().value()).toBe("Test Todo");
    });

    it("should return null when todo does not exist", () => {
      // Arrange
      jest.spyOn(repository, "getById").mockReturnValue(null);
      const todoId = TodoId.of("non-existent-id");

      // Act
      const result = query.execute(todoId);

      // Assert
      expect(repository.getById).toHaveBeenCalledWith(todoId);
      expect(result).toBeNull();
    });

    it("should return a todo with all domain properties intact", () => {
      // Arrange
      const createdAt = new Date("2024-01-01");
      const mockTodo = Todo.reconstruct(
        "1",
        "Complete Task",
        "Long description",
        true,
        createdAt,
        "done",
      );
      const todoId = TodoId.of("1");
      jest.spyOn(repository, "getById").mockReturnValue(mockTodo);

      // Act
      const result = query.execute(todoId);

      // Assert
      expect(result?.completed()).toBe(true);
      expect(result?.description()).toBe("Long description");
      expect(result?.createdAt()).toEqual(createdAt);
      expect(result?.status()).toBe("done");
    });
  });
});
