import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/entities/user.entity";
import { Url, UrlSchema } from "../../entities/url.entity";
import { AuthService } from "../auth/auth.service";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { UserService } from "../user/user.service";
import { UrlController } from "./url.controller";
import { UrlService } from "./url.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UrlService, JwtStrategy, AuthService, UserService],
  controllers: [UrlController],
})
export class UrlModule {}
