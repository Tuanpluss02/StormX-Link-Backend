import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { User } from "src/entities/user.entity";

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDTO: RegisterDTO): Promise<{ accessToken: string }> {
    try {
      const { username, password } = registerDTO;
      const newUser = await this.userService.createUser(username, password);
      const payload = { sub: newUser.id, username: newUser.username };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
        secret: process.env.SECRET_KEY,
      });
      // const token = await this.jwtService.signAsync(payload);
      return { accessToken: token };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    try {
      const { username, password } = loginDTO;
      const user = await this.userService.userLogin(username, password);
      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
        secret: process.env.SECRET_KEY,
      });
      // const token = await this.jwtService.signAsync(payload);
      return { accessToken: token };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async validateUser(payload: any): Promise<User> {
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }
}
