import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { UrlModule } from "./url/url.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot("mongodb://root:admin@localhost:27017", { dbName: "url-shortener" }),
    AuthModule,
    UserModule,
    UrlModule,
  ],
})
export class AppModule { }
