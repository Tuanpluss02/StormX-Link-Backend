import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dto/register.dto";
import { PasswordUtil } from "src/utilities/passwordUltil";
import { LoginDTO } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("register")
  async register(@Body() registerDTO: RegisterDTO) {
    return await this.authService.register(registerDTO);
  }
  @Post("login")
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }
}
