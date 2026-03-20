import { Test, TestingModule } from "@nestjs/testing";
import { GetTodosQuery } from "@/todos/query/get-todos.query";
import { TodoRepository } from "@/todos/repository/todo.repository";
import { Todo } from "@/todos/domain/todo";

describe("GetTodosQuery", () => {
  let query: GetTodosQuery;
  let repository: TodoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTodosQuery,
        {
          provide: TodoRepository,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    query = module.get<GetTodosQuery>(GetTodosQuery);
    repository = module.get<TodoRepository>(TodoRepository);
  });

  describe("execute", () => {
    it("should return a TodosList with all todos from repository", () => {
      // Arrange
      const mockTodos = [
        Todo.reconstruct("1", "Test Todo 1", "Description 1", false, new Date()),
        Todo.reconstruct("2", "Test Todo 2", null, true, new Date()),
      ];
      jest.spyOn(repository, "getAll").mockReturnValue(mockTodos);

      // Act
      const result = query.execute();

      // Assert
      expect(repository.getAll).toHaveBeenCalled();
      expect(result.list.length).toBe(2);
      expect(result.list[0].id().value()).toBe("1");
      expect(result.list[1].id().value()).toBe("2");
    });

    it("should return an empty TodosList when no todos exist", () => {
      // Arrange
      jest.spyOn(repository, "getAll").mockReturnValue([]);

      // Act
      const result = query.execute();

      // Assert
      expect(repository.getAll).toHaveBeenCalled();
      expect(result.list.length).toBe(0);
    });

    it("should construct domain objects from repository data", () => {
      // Arrange
      const mockTodos = [Todo.reconstruct("1", "Task", null, false, new Date(), "todo")];
      jest.spyOn(repository, "getAll").mockReturnValue(mockTodos);

      // Act
      const result = query.execute();

      // Assert
      expect(result.list[0]).toBeInstanceOf(Todo);
      expect(result.list[0].title().value()).toBe("Task");
      expect(result.list[0].completed()).toBe(false);
      expect(result.list[0].status()).toBe("todo");
    });
  });
});
