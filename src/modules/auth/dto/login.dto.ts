import {
  IsAlphanumeric,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
