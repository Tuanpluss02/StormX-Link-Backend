import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { UrlModule } from "./modules/url/url.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UserController } from './modules/user/user.controller';
import { config } from "./config/configuration";
// import  {ConfigurationService}  from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    // MongooseModule.forRoot(
    //   config. ,{dbName: process.env.MONGO_DB_NAME}
    // ),
    AuthModule,
    UserModule,
    UrlModule,
  ],
  controllers: [UserController],
})
export class AppModule { }
