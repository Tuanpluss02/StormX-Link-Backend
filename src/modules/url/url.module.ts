import { Module } from "@nestjs/common";
import { UrlService } from "./url.service";
import { UrlController } from "./url.controller";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { Url, UrlSchema } from "../../entities/url.entity";
import { AppConfig } from "src/common/config/configuration";
import { JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),],
  providers: [UrlService, AppConfig, JwtStrategy],
  controllers: [UrlController],
})
export class UrlModule { }
