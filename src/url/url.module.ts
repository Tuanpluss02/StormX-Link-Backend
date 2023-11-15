import { Module } from "@nestjs/common";
import { UrlService } from "./url.service";
import { UrlController } from "./url.controller";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { UrlSchema } from "./schemas/url.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: "URL", schema: UrlSchema }])],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
