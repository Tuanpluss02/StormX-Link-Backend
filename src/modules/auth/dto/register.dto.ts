import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    description: "Username",
    default: "admin",
  })
  readonly username: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    description: "Password",
    default: "admin",
  })
  readonly password: string;
}
