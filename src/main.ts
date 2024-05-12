import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('The URL Shortener API description')
    .setVersion('1.0').addBearerAuth(

  ).addBasicAuth(
  )
    .addTag('Auth').addTag('User').addTag('URL')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  await app.listen(3000, () => {
    console.log('\x1b[33m%s\x1b[0m', '🔥 Server is running on port 3000');
    console.log('\x1b[36m%s\x1b[0m', '🚀 See docs at http://localhost:3000/api/v1/docs');
  });
}
bootstrap();
