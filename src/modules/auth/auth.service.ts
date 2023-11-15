import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/entities/user.entity";
import { Model } from "mongoose";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { PasswordUtil } from "src/utilities/passwordUltil";
import { iResponse } from "src/utilities/responseHandle";

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
        return iResponse(HttpStatus.BAD_REQUEST, "User already exists");
      }
      const plainPassword = registerDTO.password;
      const hashedPassword = await PasswordUtil.hashPassword(plainPassword);
      const newUser = new this.userModel({
        username: registerDTO.username,
        password: hashedPassword,
      });
      await newUser.save();
      const payload = { sub: newUser.id, username: newUser.username };
      const token = await this.jwtService.signAsync(newUser);
      return iResponse(HttpStatus.CREATED, "User created successfully", token);
    } catch (error) {
      return new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginDTO: LoginDTO) {
    try {
      const user = await this.userModel.findOne({
        username: loginDTO.username,
      });
      if (!user) {
        return new UnauthorizedException('Invalid username or password');
      }
      const checkPassword = await PasswordUtil.comparePassword(
        loginDTO.password,
        user.password,
      );
      if (!checkPassword) {
        return new UnauthorizedException('Invalid username or password');
      }
      const token = await this.jwtService.signAsync(user);
      return iResponse(HttpStatus.OK, "Login successfully", token);
    } catch (error) {
      return new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }
  }
}
