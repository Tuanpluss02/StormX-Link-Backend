import { ApiProperty } from "@nestjs/swagger";

export class AuthTokenResponseDto {
  @ApiProperty({
    description: "JWT access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken: string;

  @ApiProperty({
    description: "Token type",
    example: "Bearer",
  })
  tokenType: string;

  @ApiProperty({
    description: "Token expiration time",
    example: "1h",
  })
  expiresIn: string;
}
