import { Injectable } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/entities/user.entity";
import { Model } from "mongoose";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { PasswordUtil } from "src/utilities/passwordUltil";

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    try {
      const userExist = await this.userModel.findOne({
        username: registerDTO.username,
      });
      if (userExist) {
        return {
          message: "User already exist",
        };
      }
      const plainPassword = registerDTO.password;
      const hashedPassword = await PasswordUtil.hashPassword(plainPassword);
      const newUser = new this.userModel({
        username: registerDTO.username,
        password: hashedPassword,
      });
      await newUser.save();
      return await this.jwtService.createToken(newUser);
    } catch (error) {
      return {
        message: "Something went wrong",
        error: error,
      };
    }
  }

  async login(loginDTO: LoginDTO) {
    try {
      const user = await this.userModel.findOne({
        username: loginDTO.username,
      });
      if (!user) {
        return {
          message: "User not found",
        };
      }
      const checkPassword = await PasswordUtil.comparePassword(
        loginDTO.password,
        user.password,
      );
      console.log(user);

      if (!checkPassword) {
        return {
          message: "Username or password invalid",
        };
      }
      return await this.jwtService.createToken(user);
    } catch (error) {
      return {
        message: "Something went wrong",
        error: error,
      };
    }
  }
}
