import { Injectable } from '@nestjs/common';
import { Status } from '@/statuses/domain/status';
import { StatusRepository } from '@/statuses/repository/status.repository';
import { StatusResponseDto } from '@/statuses/dto/status.response.dto';
import { BusinessLogicError } from '@/shared/domain/errors/business-logic.error';

@Injectable()
export class CreateStatusCommand {
  constructor(private readonly repository: StatusRepository) {}

  execute(label: string): StatusResponseDto {
    const status = Status.create(label);

    const existing = this.repository.findBySlug(status.slug());
    if (existing) {
      throw new BusinessLogicError(
        `Status with slug "${status.slug()}" already exists`,
      );
    }

    this.repository.save(status);

    return new StatusResponseDto(status.id(), status.label(), status.slug());
  }
}
