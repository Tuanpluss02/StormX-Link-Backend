import { Injectable } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/interfaces/user.interface";
import { Model } from "mongoose";
import { AuthDto } from "./dto/auth.dto";

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const userExist = await this.userModel.findOne({
      username: authDto.username,
    });
    if (userExist) {
      return {
        message: "User already exist",
      };
    }
    const user = await this.userModel.create(authDto);
    return await this.jwtService.createToken(user);
  }

  async login(authDto: AuthDto) {
    const user = await this.userModel.findOne({
      username: authDto.username,
    });
    if (!user) {
      return {
        message: "User not found",
      };
    }
    return await this.jwtService.createToken(user);
  }
}
