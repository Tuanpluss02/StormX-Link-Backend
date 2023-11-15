import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";

export class NewUrlDTO {
  @IsNotEmpty()
  @IsUrl()
  readonly longUrl: string;

  @IsString()
  @IsAlphanumeric()
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  readonly urlCode: string;
}
