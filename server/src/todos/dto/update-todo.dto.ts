import { IsString, IsOptional, MaxLength, IsBoolean, IsIn } from "class-validator";
import { VALID_STATUSES } from "@/todos/domain/todo";

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(VALID_STATUSES)
  status?: string;
}
