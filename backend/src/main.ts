import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
//import * as dotenv from 'dotenv';

//dotenv.config();

async function bootstrap() {
  console.log('Starting server...🙈');
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS
  app.useGlobalPipes(new ValidationPipe()); // Enable validation pipes

  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_UI_TITLE || '')
    .setDescription(process.env.SWAGGER_UI_DESCRIPTION || '')
    .setVersion(process.env.SWAGGER_UI_VERSION || '')
    .addTag(process.env.SWAGGER_UI_TAG || '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_UI_PATH || '', app, document, {
    jsonDocumentUrl: process.env.SWAGGER_JSON_PATH || '',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000} 🤖`);
  console.log(`__dirname: ${__dirname}`);
}
bootstrap();
