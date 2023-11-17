import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { Response } from "express";
import { iResponse } from "src/utilities/responseHandle";
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("api/v1/auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("register")
  @ApiBody({ type: RegisterDTO })
  async register(@Body() registerDTO: RegisterDTO, @Res() response: Response) {
    const result = await this.authService.register(registerDTO);
    return iResponse(response, HttpStatus.OK, "Registration successful", result);
  }

  @Post("login")
  @ApiBody({ type: LoginDTO , description: "Login", required: true})
  async login(@Body() loginDTO: LoginDTO, @Res() response: Response) {
    const result = await this.authService.login(loginDTO);
    return iResponse(response, HttpStatus.OK, "Login successful", result);
  }

  // @Post("refresh-token")
  // async refreshToken(@Res() response: Response) {
  //   const result = await this.authService.refreshToken();
  //   return iResponse(response, HttpStatus.OK, "Refresh token success", result);
  // }
}
