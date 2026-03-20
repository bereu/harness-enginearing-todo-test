import { Test, TestingModule } from "@nestjs/testing";
import { CreateStatusCommand } from "@/statuses/command/create-status.command";
import { StatusRepository } from "@/statuses/repository/status.repository";
import { StatusResponseDto } from "@/statuses/dto/status.response.dto";
import { Status } from "@/statuses/domain/status";
import { BusinessLogicError } from "@/shared/domain/errors/business-logic.error";

describe("CreateStatusCommand", () => {
  let command: CreateStatusCommand;
  let repository: StatusRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStatusCommand,
        {
          provide: StatusRepository,
          useValue: {
            findBySlug: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<CreateStatusCommand>(CreateStatusCommand);
    repository = module.get<StatusRepository>(StatusRepository);
  });

  describe("execute", () => {
    it("should create a status and return response DTO", () => {
      // Arrange
      jest.spyOn(repository, "findBySlug").mockReturnValue(null);
      jest.spyOn(repository, "save").mockReturnValue(undefined);

      // Act
      const result = command.execute("In Review");

      // Assert
      expect(result).toBeInstanceOf(StatusResponseDto);
      expect(result.slug).toBe("in-review");
      expect(result.label).toBe("In Review");
      expect(result.id).toBeDefined();
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it("should generate slug from label correctly", () => {
      // Arrange
      jest.spyOn(repository, "findBySlug").mockReturnValue(null);
      jest.spyOn(repository, "save").mockReturnValue(undefined);

      // Act
      const result = command.execute("Waiting For Review");

      // Assert
      expect(result.slug).toBe("waiting-for-review");
    });

    it("should throw BusinessLogicError when slug already exists", () => {
      // Arrange
      const existing = Status.reconstruct("00000000-0000-0000-0000-000000000001", "To Do", "todo");
      jest.spyOn(repository, "findBySlug").mockReturnValue(existing);

      // Act & Assert
      expect(() => command.execute("Todo")).toThrow(BusinessLogicError);
      expect(() => command.execute("Todo")).toThrow(/already exists/);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it("should throw when label is empty", () => {
      // Act & Assert
      expect(() => command.execute("")).toThrow();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it("should throw when label exceeds 50 characters", () => {
      // Arrange
      const longLabel = "a".repeat(51);

      // Act & Assert
      expect(() => command.execute(longLabel)).toThrow();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it("should trim whitespace from label", () => {
      // Arrange
      jest.spyOn(repository, "findBySlug").mockReturnValue(null);
      jest.spyOn(repository, "save").mockReturnValue(undefined);

      // Act
      const result = command.execute("  In Review  ");

      // Assert
      expect(result.label).toBe("In Review");
      expect(result.slug).toBe("in-review");
    });
  });
});
