import { Test, TestingModule } from "@nestjs/testing";
import { GetLabelsForTodoQuery } from "@/todos/query/get-labels-for-todo.query";
import { TodoLabelRepository } from "@/todos/repository/todo-label.repository";
import { Label } from "@/todos/domain/label";

describe("GetLabelsForTodoQuery", () => {
  let query: GetLabelsForTodoQuery;
  let todoLabelRepository: TodoLabelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLabelsForTodoQuery,
        {
          provide: TodoLabelRepository,
          useValue: {
            getLabelsForTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    query = module.get<GetLabelsForTodoQuery>(GetLabelsForTodoQuery);
    todoLabelRepository = module.get<TodoLabelRepository>(TodoLabelRepository);
  });

  describe("execute", () => {
    it("should return empty array when todo has no labels", () => {
      jest.spyOn(todoLabelRepository, "getLabelsForTodo").mockReturnValue([]);

      const result = query.execute("todo-1");

      expect(result).toEqual([]);
    });

    it("should return label DTOs for a todo with labels", () => {
      const label = Label.reconstruct("label-id-1", "Bug", "#EF4444");
      jest.spyOn(todoLabelRepository, "getLabelsForTodo").mockReturnValue([label]);

      const result = query.execute("todo-1");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("label-id-1");
      expect(result[0].name).toBe("Bug");
      expect(result[0].color).toBe("#EF4444");
    });
  });
});
