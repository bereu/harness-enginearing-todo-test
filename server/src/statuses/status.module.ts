import { Module } from "@nestjs/common";
import { StatusController } from "@/statuses/status.controller";
import { GetStatusesQuery } from "@/statuses/query/get-statuses.query";
import { CreateStatusCommand } from "@/statuses/command/create-status.command";
import { StatusRepository } from "@/statuses/repository/status.repository";
import { StatusDataSource } from "@/statuses/datasource/status.datasource";

@Module({
  controllers: [StatusController],
  providers: [StatusDataSource, StatusRepository, GetStatusesQuery, CreateStatusCommand],
})
export class StatusModule {}
