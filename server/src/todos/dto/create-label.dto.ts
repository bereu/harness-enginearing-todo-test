import { IsString, IsNotEmpty, MaxLength, Matches } from "class-validator";

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: "color must be a valid hex color (e.g. #FF5733)",
  })
  color: string;
}
