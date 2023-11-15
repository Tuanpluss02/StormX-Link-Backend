import { IsAlphanumeric, IsNotEmpty } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
