import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>("REDIS_URL");
        const redisHost = configService.get<string>("REDIS_HOST", "localhost");
        const redisPort = configService.get<number>("REDIS_PORT", 6379);
        const redisPassword = configService.get<string>("REDIS_PASSWORD");

        // If Redis URL is provided, use it; otherwise use host/port
        const redisConfig = redisUrl
          ? { url: redisUrl }
          : {
              host: redisHost,
              port: redisPort,
              password: redisPassword,
            };

        return {
          store: redisStore,
          socket: redisConfig,
          ttl: 3600, // 1 hour default TTL
          max: 10000, // Maximum number of items in cache
          refreshThreshold: 300, // 5 minutes
          // Connection pool settings
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          retryDelayOnFailover: 100,
          enableOfflineQueue: false,
          // Performance settings
          keyPrefix: "stormx:",
          compress: true,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
})
export class CacheConfigModule {}
