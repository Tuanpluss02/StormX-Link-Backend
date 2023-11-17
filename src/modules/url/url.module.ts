import { Module } from "@nestjs/common";
import { UrlService } from "./url.service";
import { UrlController } from "./url.controller";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { Url, UrlSchema } from "../../entities/url.entity";
import { AppConfig } from "src/common/config/configuration";
import { JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { AuthService } from "../auth/auth.service";
import { User, UserSchema } from "src/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  providers: [UrlService, AppConfig, JwtStrategy, AuthService,UserService],
  controllers: [UrlController],
})
export class UrlModule { }
