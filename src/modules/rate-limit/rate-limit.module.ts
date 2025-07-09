import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => [
        {
          name: "short",
          ttl: 1000, // 1 second
          limit: 3, // 3 requests per second
        },
        {
          name: "medium",
          ttl: 60000, // 1 minute
          limit: 20, // 20 requests per minute
        },
        {
          name: "long",
          ttl: 3600000, // 1 hour
          limit: 100, // 100 requests per hour
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
