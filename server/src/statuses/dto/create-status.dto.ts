import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  label: string;
}
