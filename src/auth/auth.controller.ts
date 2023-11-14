import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { log } from "console";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("register")
  async register(@Body() authDto: AuthDto) {
    console.log("authDto", authDto);
    return await this.authService.register(authDto);
  }
  @Post("login")
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto);
  }
}
