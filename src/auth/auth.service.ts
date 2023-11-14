import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
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
    const user = await this.userModel.create(authDto);
    return await this.jwtService.createToken(user);
  }
}
