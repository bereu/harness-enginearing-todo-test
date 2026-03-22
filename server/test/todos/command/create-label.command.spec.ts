import { Test, TestingModule } from "@nestjs/testing";
import { CreateLabelCommand } from "@/todos/command/create-label.command";
import { LabelRepository } from "@/todos/repository/label.repository";
import { CreateLabelDto } from "@/todos/dto/create-label.dto";
import { BusinessLogicError } from "@/shared/domain/errors/business-logic.error";
import { Label } from "@/todos/domain/label";

describe("CreateLabelCommand", () => {
  let command: CreateLabelCommand;
  let repository: LabelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLabelCommand,
        {
          provide: LabelRepository,
          useValue: {
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<CreateLabelCommand>(CreateLabelCommand);
    repository = module.get<LabelRepository>(LabelRepository);
  });

  describe("execute", () => {
    it("should create a label and return response dto", () => {
      const dto: CreateLabelDto = {
        name: "Bug",
        color: "#FF0000",
      } as CreateLabelDto;
      jest.spyOn(repository, "findByName").mockReturnValue(null);
      jest.spyOn(repository, "save").mockReturnValue(undefined);

      const result = command.execute(dto);

      expect(result.name).toBe("Bug");
      expect(result.color).toBe("#FF0000");
      expect(result.id).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it("should throw BusinessLogicError when label name already exists", () => {
      const dto: CreateLabelDto = {
        name: "Bug",
        color: "#FF0000",
      } as CreateLabelDto;
      const existingLabel = Label.create("Bug", "#FF0000");
      jest.spyOn(repository, "findByName").mockReturnValue(existingLabel);

      expect(() => command.execute(dto)).toThrow(BusinessLogicError);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it("should throw when color is invalid hex", () => {
      const dto: CreateLabelDto = {
        name: "Bug",
        color: "red",
      } as CreateLabelDto;
      jest.spyOn(repository, "findByName").mockReturnValue(null);

      expect(() => command.execute(dto)).toThrow();
    });

    it("should throw when name is empty", () => {
      const dto: CreateLabelDto = {
        name: "",
        color: "#FF0000",
      } as CreateLabelDto;
      jest.spyOn(repository, "findByName").mockReturnValue(null);

      expect(() => command.execute(dto)).toThrow();
    });
  });
});
