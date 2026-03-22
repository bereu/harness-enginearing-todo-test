import {
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsUUID,
} from "class-validator";

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
  @IsNotEmpty()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  labelIds?: string[];
}
