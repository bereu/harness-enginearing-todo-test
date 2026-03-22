import { Injectable } from "@nestjs/common";
import { LabelRepository } from "@/todos/repository/label.repository";
import { LabelResponseDto } from "@/todos/dto/label.response.dto";

@Injectable()
export class GetLabelsQuery {
  constructor(private readonly repository: LabelRepository) {}

  execute(): LabelResponseDto[] {
    return this.repository
      .findAll()
      .getAll()
      .map((label) => new LabelResponseDto(label.id().value(), label.name(), label.color()));
  }
}
