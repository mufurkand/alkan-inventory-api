import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VALIDATION_PIPE_OPTIONS } from './lib/constants/constants';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use(json({ limit: '1mb' }));
  app.enableCors();
  await app.listen(parseInt(process.env.PORT || '3456'));
}
bootstrap();
