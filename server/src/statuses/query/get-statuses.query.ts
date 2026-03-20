import { Injectable } from '@nestjs/common';
import { StatusRepository } from '@/statuses/repository/status.repository';
import { StatusResponseDto } from '@/statuses/dto/status.response.dto';

@Injectable()
export class GetStatusesQuery {
  constructor(private readonly repository: StatusRepository) {}

  execute(): StatusResponseDto[] {
    const statusesList = this.repository.findAll();
    return statusesList
      .getAll()
      .map((s) => new StatusResponseDto(s.id(), s.label(), s.slug()));
  }
}
