import { IsAlphanumeric, IsNotEmpty, MaxLength, MinLength } from "class-validator";


export class AuthDto {
    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    readonly username: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    readonly password: string;
}