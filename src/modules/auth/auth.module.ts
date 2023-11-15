import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/entities/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
// import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
    }),
      
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
