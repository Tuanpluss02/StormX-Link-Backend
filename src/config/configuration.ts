import { ConfigService } from '@nestjs/config';

export const config = (configService: ConfigService) => ({
  mongoUri: configService.get<string>('MONGO_URI'),
  mongoDbName: configService.get<string>('MONGO_DB_NAME'),
  mongoUser: configService.get<string>('MONGO_USER'),
  mongoPassword: configService.get<string>('MONGO_PASSWORD'),
  baseShortUrl: configService.get<string>('BASE_SHORT_URL'),
  frontendUrl: configService.get<string>('FRONTEND_URL'),
  secretKey: configService.get<string>('SECRET_KEY'),
  accessTokenExpires: configService.get<string>('ACCESS_TOKEN_EXPIRES'),
});