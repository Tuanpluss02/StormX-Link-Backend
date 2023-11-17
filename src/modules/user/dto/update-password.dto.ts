import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class UpdateUserPasswordDTO {
    @IsNotEmpty()
    @ApiProperty(
      {
        type: String,
        description: "Old Password",
        default: "admin",
      },
    )
    readonly oldPassword: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty(
      {
        type: String,
        description: "New Password",
        default: "admin",
      },
    )
    readonly newPassword: string;
}