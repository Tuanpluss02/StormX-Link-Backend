import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, ValidateIf } from "class-validator";

export class NewUrlDTO {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty(
    {
      type: String,
      description: "Long URL",
      default: "https://www.google.com",
      required: true,
    },
  )
  readonly longUrl: string;

  @IsString()
  @IsOptional()
  @Matches(/^(?!.*[-_.]{2})[A-Za-z0-9]+[A-Za-z0-9_.\-]*[A-Za-z0-9]$/, { message: "URL Code is not valid. It should not have consecutive special characters or start/end with a special character." }) 
  @ValidateIf((object, value) => value !== '')
  @ApiProperty(
    {
      type: String,
      description: "Custom URL",
      default: "google",
      required: false,
    },
  )
  readonly urlCode: string;
}
