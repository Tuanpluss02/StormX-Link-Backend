import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { Response } from "express";
import { iResponse } from "src/utilities/responseHandle";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("register")
  async register(@Body() registerDTO: RegisterDTO, @Res() response: Response) {
    const result = await this.authService.register(registerDTO);
    return iResponse(response, HttpStatus.OK, "Register success", result);
  }

  @Post("login")
  async login(@Body() loginDTO: LoginDTO, @Res() response: Response) {
    const result = await this.authService.login(loginDTO);
    return iResponse(response, HttpStatus.OK, "Login success", result);
  }
}
