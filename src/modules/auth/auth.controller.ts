import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthTokenResponse } from "src/config/jwt.config";
import { AuthService } from "./auth.service";
import { AuthTokenResponseDto } from "./dto/auth-token-response.dto";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

@Controller("api/v1/auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User registered successfully",
    type: AuthTokenResponseDto,
  })
  async register(@Body() registerDTO: RegisterDTO): Promise<{
    statusCode: number;
    message: string;
    data: AuthTokenResponse;
  }> {
    const result = await this.authService.register(registerDTO);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Registration successful",
      data: result,
    };
  }

  @Post("login")
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: LoginDTO, description: "Login", required: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged in successfully",
    type: AuthTokenResponseDto,
  })
  async login(@Body() loginDTO: LoginDTO): Promise<{
    statusCode: number;
    message: string;
    data: AuthTokenResponse;
  }> {
    const result = await this.authService.login(loginDTO);
    return {
      statusCode: HttpStatus.OK,
      message: "Login successful",
      data: result,
    };
  }
}
