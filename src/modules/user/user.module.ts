import { Module } from "@nestjs/common";
import { UserService } from './user.service';
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/entities/user.entity";
import { Url, UrlSchema } from "src/entities/url.entity";
import { UrlModule } from "../url/url.module";
import { UrlService } from "../url/url.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],

})
export class UserModule { }
