import { Module } from "@nestjs/common";
import { UrlService } from "./url.service";
import { UrlController } from "./url.controller";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { Url, UrlSchema } from "../../entities/url.entity";

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
