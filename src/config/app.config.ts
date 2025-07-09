import { ConfigService } from "@nestjs/config";

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  rateLimit: {
    ttl: number;
    limit: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  database: {
    uri: string;
    name: string;
    connectionPool: {
      maxPoolSize: number;
      minPoolSize: number;
      maxIdleTimeMS: number;
    };
  };
}

export const getAppConfig = (configService: ConfigService): AppConfig => {
  return {
    port: parseInt(configService.get<string>("PORT", "3000"), 10),
    nodeEnv: configService.get<string>("NODE_ENV", "development"),
    corsOrigins: configService.get<string>("CORS_ORIGINS", "*").split(","),
    rateLimit: {
      ttl: parseInt(configService.get<string>("RATE_LIMIT_TTL", "60"), 10),
      limit: parseInt(configService.get<string>("RATE_LIMIT_MAX", "10"), 10),
    },
    jwt: {
      secret: configService.get<string>("SECRET_KEY", "your-secret-key"),
      expiresIn: configService.get<string>("ACCESS_TOKEN_EXPIRES", "1h"),
    },
    database: {
      uri: configService.get<string>("MONGO_URI", "mongodb://localhost:27017"),
      name: configService.get<string>("MONGO_DB_NAME", "stormx_link"),
      connectionPool: {
        maxPoolSize: parseInt(
          configService.get<string>("DB_MAX_POOL_SIZE", "100"),
          10,
        ),
        minPoolSize: parseInt(
          configService.get<string>("DB_MIN_POOL_SIZE", "5"),
          10,
        ),
        maxIdleTimeMS: parseInt(
          configService.get<string>("DB_MAX_IDLE_TIME", "300000"),
          10,
        ),
      },
    },
  };
};
