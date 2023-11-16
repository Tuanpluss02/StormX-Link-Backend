import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as jwt from "jsonwebtoken";
import { User } from "src/user/interfaces/user.interface";

@Injectable()
export class JwtService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}
  async createToken(user: User) {
    const expiresIn = 60 * 60 * 24 * 3;
    const secretKey = process.env.SECRET_KEY;
    const payload = { id: user._id, name: user.username };
    const accessToken = jwt.sign(payload, secretKey, { expiresIn });
    return {
      expiresIn: expiresIn,
      accessToken: accessToken,
    };
  }
  async validateUser(payload: any): Promise<any> {
    return await this.userModel.findOne({ _id: payload.id });
  }
  async validateUserToken(payload: any): Promise<any> {
    return await this.userModel.findOne({ _id: payload.id });
  }
}
