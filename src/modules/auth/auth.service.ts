import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/entities/user.entity";
import { Model } from "mongoose";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { PasswordUtil } from "src/utilities/passwordUltil";
import { iResponse } from "src/utilities/responseHandle";
import { UserService } from "../user/user.service";

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    try {
      const { username, password } = registerDTO;
      const newUser = await this.userService.createUser(username, password);
      const payload = { sub: newUser.id, username: newUser.username };
      const token = await this.jwtService.signAsync(payload);
      return iResponse(HttpStatus.CREATED, "User created successfully", token);
    } catch (error) {
      return new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginDTO: LoginDTO) {
    try {
      const { username, password } = loginDTO;
      const user = await this.userService.userLogin(username, password);
      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload);
      return iResponse(HttpStatus.OK, "Login successfully", token);
    } catch (error) {
      return new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }
  }
  async validateUser(payload: any) {
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }
    return user;
  }

}
