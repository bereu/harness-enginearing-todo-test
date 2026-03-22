import { Test, TestingModule } from "@nestjs/testing";
import { SetLabelsForTodoCommand } from "@/todos/command/set-labels-for-todo.command";
import { TodoLabelRepository } from "@/todos/repository/todo-label.repository";
import { LabelRepository } from "@/todos/repository/label.repository";
import { LabelsList } from "@/todos/domain/labels-list";
import { Label } from "@/todos/domain/label";
import { BusinessLogicError } from "@/shared/domain/errors/business-logic.error";

describe("SetLabelsForTodoCommand", () => {
  let command: SetLabelsForTodoCommand;
  let todoLabelRepository: TodoLabelRepository;
  let labelRepository: LabelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetLabelsForTodoCommand,
        {
          provide: TodoLabelRepository,
          useValue: {
            setLabels: jest.fn(),
          },
        },
        {
          provide: LabelRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<SetLabelsForTodoCommand>(SetLabelsForTodoCommand);
    todoLabelRepository = module.get<TodoLabelRepository>(TodoLabelRepository);
    labelRepository = module.get<LabelRepository>(LabelRepository);
  });

  describe("execute", () => {
    const existingLabel = Label.reconstruct("label-uuid-1", "Bug", "#EF4444");

    it("should set labels successfully when all label IDs are valid", () => {
      jest.spyOn(labelRepository, "findAll").mockReturnValue(LabelsList.create([existingLabel]));
      jest.spyOn(todoLabelRepository, "setLabels").mockReturnValue(undefined);

      command.execute("todo-1", ["label-uuid-1"]);

      expect(todoLabelRepository.setLabels).toHaveBeenCalledWith("todo-1", ["label-uuid-1"]);
    });

    it("should clear labels when labelIds is empty", () => {
      jest.spyOn(labelRepository, "findAll").mockReturnValue(LabelsList.empty());
      jest.spyOn(todoLabelRepository, "setLabels").mockReturnValue(undefined);

      command.execute("todo-1", []);

      expect(todoLabelRepository.setLabels).toHaveBeenCalledWith("todo-1", []);
    });

    it("should throw BusinessLogicError when label ID does not exist", () => {
      jest.spyOn(labelRepository, "findAll").mockReturnValue(LabelsList.empty());

      expect(() => command.execute("todo-1", ["non-existent-id"])).toThrow(BusinessLogicError);
      expect(todoLabelRepository.setLabels).not.toHaveBeenCalled();
    });

    it("should throw BusinessLogicError for the specific unknown label ID", () => {
      jest.spyOn(labelRepository, "findAll").mockReturnValue(LabelsList.create([existingLabel]));

      expect(() => command.execute("todo-1", ["label-uuid-1", "unknown-id"])).toThrow(
        BusinessLogicError,
      );
    });
  });
});
