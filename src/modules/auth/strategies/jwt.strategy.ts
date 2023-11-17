import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "src/entities/user.entity";
import { AuthService } from "../auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { request } from "express";

@Injectable({})
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')  {
  constructor( private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      
    });
  }
  async validate(payload: any): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    request.user = user;
    return user;
  }
}
