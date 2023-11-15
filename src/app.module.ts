import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { UrlModule } from "./modules/url/url.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI,{dbName: process.env.MONGO_DB_NAME}
    ),
    AuthModule,
    UserModule,
    UrlModule,
  ],
})
export class AppModule { }
