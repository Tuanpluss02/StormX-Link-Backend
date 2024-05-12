import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    type: String,
    description: "Username",
    default: "admin",
  })
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "Password",
    default: "admin",
  })
  readonly password: string;
}
