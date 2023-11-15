import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import { Url, UrlSchema } from "src/entities/url.entity";

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
    }),
    ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
