import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/entities/user.entity";
import { JwtService } from "./jwt.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
