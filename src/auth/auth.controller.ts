import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post("register")
    register() {
        return this.authService.getToken();
    }
    @Post("login")
    login() {
        return this.authService.getToken();
    }
}
