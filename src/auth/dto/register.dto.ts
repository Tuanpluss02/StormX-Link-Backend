import {
  IsAlphanumeric,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(20)
  readonly username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(4)
  @MaxLength(20)
  readonly password: string;
}
