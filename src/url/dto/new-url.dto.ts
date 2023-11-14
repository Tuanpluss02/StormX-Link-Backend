import { IsAlphanumeric, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class NewUrlDTO {
  @IsNotEmpty()
  @IsUrl()
  readonly longUrl: string;

  @IsString()
  @IsAlphanumeric()
  readonly urlCode: string;
}
