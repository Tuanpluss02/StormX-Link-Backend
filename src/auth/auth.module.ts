import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchemas } from "src/user/schemas/user.schema";
import { JwtService } from "./jwt.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchemas }])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
