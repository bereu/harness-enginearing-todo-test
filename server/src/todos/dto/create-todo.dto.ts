import { IsString, IsNotEmpty, IsOptional, MaxLength, IsIn } from "class-validator";
import { VALID_STATUSES } from "@/todos/domain/todo";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_STATUSES)
  status?: string;
}
