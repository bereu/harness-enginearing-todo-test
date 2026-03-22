import { Injectable } from "@nestjs/common";
import { Label } from "@/todos/domain/label";
import { LabelRepository } from "@/todos/repository/label.repository";
import { LabelResponseDto } from "@/todos/dto/label.response.dto";
import { CreateLabelDto } from "@/todos/dto/create-label.dto";
import { BusinessLogicError } from "@/shared/domain/errors/business-logic.error";

@Injectable()
export class CreateLabelCommand {
  constructor(private readonly repository: LabelRepository) {}

  execute(dto: CreateLabelDto): LabelResponseDto {
    const existing = this.repository.findByName(dto.name);
    if (existing) {
      throw new BusinessLogicError(`Label with name "${dto.name}" already exists`);
    }

    const label = Label.create(dto.name, dto.color);
    this.repository.save(label);

    return new LabelResponseDto(label.id().value(), label.name(), label.color());
  }
}
