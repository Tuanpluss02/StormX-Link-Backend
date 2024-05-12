import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsAlphanumeric,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from "class-validator";

export class UpdateUrlDTO {
  @IsString()
  @IsAlphanumeric()
  @ValidateIf((object, value) => !!(value || object.newLongUrl))
  @ApiProperty({
    type: String,
    description: "New URL Code",
    default: "google",
    required: false,
  })
  readonly newUrlCode?: string;

  @IsNotEmpty()
  @IsUrl()
  @ValidateIf((object, value) => !!(value || object.newUrlCode))
  @ApiProperty({
    type: String,
    description: "New Long URL",
    default: "https://www.google.com",
    required: false,
  })
  readonly newLongUrl?: string;

  @ValidateNested()
  validate() {
    if (!this.newUrlCode && !this.newLongUrl) {
      throw new Error("At least one field must be provided.");
    }
  }
}
