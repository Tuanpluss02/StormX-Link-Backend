import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { response } from "express";
import { STATUS_CODES } from "http";
import { Model } from "mongoose";
import { Url } from "src/entities/url.entity";
import { User } from "src/entities/user.entity";
import { PasswordUtil } from "src/utilities/passwordUltil";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Url.name) private urlModel: Model<Url>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const userExist = await this.userModel.findOne({ username: username });
    if (userExist) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await PasswordUtil.hashPassword(password);
    const newUser = new this.userModel({
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    return newUser;
  }

  async userLogin(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }
    const checkPassword = await PasswordUtil.comparePassword(
      password,
      user.password,
    );
    if (!checkPassword) {
      throw new UnauthorizedException("Invalid username or password");
    }
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException("User not found", 404);
    }
    return user;
  }
  async getAllUrls(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).populate("urls");
    if (!user) {
      throw new HttpException("User not found", 404);
    }
    return user.urls;
  }
}
