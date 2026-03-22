import { Test, TestingModule } from "@nestjs/testing";
import { GetLabelsQuery } from "@/todos/query/get-labels.query";
import { LabelRepository } from "@/todos/repository/label.repository";
import { LabelsList } from "@/todos/domain/labels-list";
import { Label } from "@/todos/domain/label";

describe("GetLabelsQuery", () => {
  let query: GetLabelsQuery;
  let repository: LabelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLabelsQuery,
        {
          provide: LabelRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    query = module.get<GetLabelsQuery>(GetLabelsQuery);
    repository = module.get<LabelRepository>(LabelRepository);
  });

  describe("execute", () => {
    it("should return empty array initially", () => {
      jest.spyOn(repository, "findAll").mockReturnValue(LabelsList.empty());

      const result = query.execute();

      expect(result).toEqual([]);
    });

    it("should return all labels as response dtos", () => {
      const label = Label.create("Bug", "#FF0000");
      jest.spyOn(repository, "findAll").mockReturnValue(LabelsList.create([label]));

      const result = query.execute();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bug");
      expect(result[0].color).toBe("#FF0000");
      expect(result[0].id).toBeDefined();
    });
  });
});
