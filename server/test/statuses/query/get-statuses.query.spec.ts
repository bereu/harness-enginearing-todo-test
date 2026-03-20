import { Test, TestingModule } from "@nestjs/testing";
import { GetStatusesQuery } from "@/statuses/query/get-statuses.query";
import { StatusRepository } from "@/statuses/repository/status.repository";
import { StatusesList } from "@/statuses/domain/statuses-list";
import { Status } from "@/statuses/domain/status";
import { StatusResponseDto } from "@/statuses/dto/status.response.dto";

describe("GetStatusesQuery", () => {
  let query: GetStatusesQuery;
  let repository: StatusRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatusesQuery,
        {
          provide: StatusRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    query = module.get<GetStatusesQuery>(GetStatusesQuery);
    repository = module.get<StatusRepository>(StatusRepository);
  });

  describe("execute", () => {
    it("should return all statuses as response DTOs", () => {
      // Arrange
      const statuses = [
        Status.reconstruct("00000000-0000-0000-0000-000000000001", "To Do", "todo"),
        Status.reconstruct("00000000-0000-0000-0000-000000000002", "In Progress", "in-progress"),
        Status.reconstruct("00000000-0000-0000-0000-000000000003", "Done", "done"),
      ];
      jest.spyOn(repository, "findAll").mockReturnValue(StatusesList.create(statuses));

      // Act
      const result = query.execute();

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(StatusResponseDto);
      expect(result[0].slug).toBe("todo");
      expect(result[0].label).toBe("To Do");
      expect(result[1].slug).toBe("in-progress");
      expect(result[2].slug).toBe("done");
    });

    it("should return empty array when no statuses exist", () => {
      // Arrange
      jest.spyOn(repository, "findAll").mockReturnValue(StatusesList.empty());

      // Act
      const result = query.execute();

      // Assert
      expect(result).toEqual([]);
    });
  });
});
