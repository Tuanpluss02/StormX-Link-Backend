import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { iResponse } from "src/utils/responseHandle";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

@Controller("api/v1/auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: RegisterDTO })
  async register(@Body() registerDTO: RegisterDTO, @Res() response: Response) {
    const result = await this.authService.register(registerDTO);
    return iResponse(
      response,
      HttpStatus.OK,
      "Registration successful",
      result,
    );
  }

  @Post("login")
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: LoginDTO, description: "Login", required: true })
  async login(@Body() loginDTO: LoginDTO, @Res() response: Response) {
    const result = await this.authService.login(loginDTO);
    return iResponse(response, HttpStatus.OK, "Login successful", result);
  }
}
