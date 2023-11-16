import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/entities/user.entity";
import { AuthService } from "../auth.service";
import { AppConfig } from "src/common/config/configuration";
import { PassportStrategy } from "@nestjs/passport";

@Injectable({})
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly appConfig: AppConfig,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return await this.authService.validateUser(payload);
  }
}
