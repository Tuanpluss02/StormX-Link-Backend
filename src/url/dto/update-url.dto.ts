import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";

export class UpdateUrlDTO {

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  readonly oldUrlCode: string;

  @IsString()
  @IsAlphanumeric()
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  readonly newUrlCode: string;

  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  readonly longUrl: string;


}
