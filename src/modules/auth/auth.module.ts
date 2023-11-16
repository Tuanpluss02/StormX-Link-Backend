import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/entities/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Url, UrlSchema } from "src/entities/url.entity";
import { AppConfig } from "src/common/config/configuration";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
    }),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, AppConfig],
})
export class AuthModule { }
