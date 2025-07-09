import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { getAppConfig } from "./config/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = getAppConfig(configService);

  // Global validation pipe with optimized settings
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: config.nodeEnv === "production",
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  });

  // Trust proxy for production (if behind reverse proxy)
  if (config.nodeEnv === "production") {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set("trust proxy", 1);
  }

  // Swagger documentation (disable in production for security)
  if (config.nodeEnv !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("StormX Link API")
      .setDescription(
        "A high-performance URL shortening service built with NestJS",
      )
      .setVersion("2.0")
      .addBearerAuth()
      .addBasicAuth()
      .addTag("Auth", "Authentication endpoints")
      .addTag("User", "User management endpoints")
      .addTag("URL", "URL shortening endpoints")
      .addTag("Health", "Health check endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/v1/docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    await app.close();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down gracefully...");
    await app.close();
    process.exit(0);
  });

  await app.listen(config.port, () => {
    console.log(
      `\x1b[33m%s\x1b[0m`,
      `🔥 Server is running on port ${config.port}`,
    );
    console.log(`\x1b[32m%s\x1b[0m`, `🌍 Environment: ${config.nodeEnv}`);

    if (config.nodeEnv !== "production") {
      console.log(
        `\x1b[36m%s\x1b[0m`,
        `📚 API Documentation: http://localhost:${config.port}/api/v1/docs`,
      );
    }

    console.log(
      `\x1b[35m%s\x1b[0m`,
      `🏥 Health Check: http://localhost:${config.port}/health`,
    );
  });
}

bootstrap().catch((error) => {
  console.error("Error starting application:", error);
  process.exit(1);
});
