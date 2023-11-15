import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDTO: RegisterDTO, @Res() response: Response) {
    console.log(process.env.SECRET_KEY);

    const result = await this.authService.register(registerDTO);
    return response.status(HttpStatus.CREATED).json(result);
  }

  @Post("login")
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }
}
