import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateStatusDto } from '@/statuses/dto/create-status.dto';
import { StatusResponseDto } from '@/statuses/dto/status.response.dto';
import { GetStatusesQuery } from '@/statuses/query/get-statuses.query';
import { CreateStatusCommand } from '@/statuses/command/create-status.command';

@Controller('statuses')
export class StatusController {
  constructor(
    private readonly getStatusesQuery: GetStatusesQuery,
    private readonly createStatusCommand: CreateStatusCommand,
  ) {}

  @Get()
  getStatuses(): StatusResponseDto[] {
    return this.getStatusesQuery.execute();
  }

  @Post()
  createStatus(@Body() createStatusDto: CreateStatusDto): StatusResponseDto {
    return this.createStatusCommand.execute(createStatusDto.label);
  }
}
