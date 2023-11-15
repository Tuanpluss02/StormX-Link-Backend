import { ConfigService } from '@nestjs/config';

export class AppConfig {
  constructor(private configService: ConfigService) {}

  getMongoUri(): string {
    return this.configService.get<string>('MONGO_URI');
  }

  getMongoDbName(): string {
    return this.configService.get<string>('MONGO_DB_NAME');
  }

  getMongoUser(): string {
    return this.configService.get<string>('MONGO_USER');
  }

  getMongoPassword(): string {
    return this.configService.get<string>('MONGO_PASSWORD');
  }

  getBaseShortUrl(): string {
    return this.configService.get<string>('BASE_SHORT_URL');
  }

  getFrontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL');
  }

  getSecretKey(): string {
    return this.configService.get<string>('SECRET_KEY');
  }

  getAccessTokenExpires(): string {
    return this.configService.get<string>('ACCESS_TOKEN_EXPIRES');
  }
}