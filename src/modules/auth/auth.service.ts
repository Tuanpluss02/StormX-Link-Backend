import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { JwtPayload, AuthTokenResponse } from "src/config/jwt.config";
import { UserService } from "../user/user.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<AuthTokenResponse> {
    try {
      const { username, password } = registerDTO;
      const newUser = await this.userService.createUser(username, password);

      const tokenResponse = await this.generateTokenResponse(newUser);

      this.logger.log(`User registered successfully: ${username}`);
      return tokenResponse;
    } catch (error) {
      this.logger.error(
        `Registration failed for ${registerDTO.username}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDTO: LoginDTO): Promise<AuthTokenResponse> {
    try {
      const { username, password } = loginDTO;
      const user = await this.userService.userLogin(username, password);

      const tokenResponse = await this.generateTokenResponse(user);

      this.logger.log(`User logged in successfully: ${username}`);
      return tokenResponse;
    } catch (error) {
      this.logger.error(
        `Login failed for ${loginDTO.username}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.userService.getUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Token validation failed for user ${payload.sub}: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException("Invalid token");
    }
  }

  private async generateTokenResponse(user: User): Promise<AuthTokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const expiresIn = this.configService.get<string>(
      "ACCESS_TOKEN_EXPIRES",
      "1h",
    );
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn,
    };
  }
}
