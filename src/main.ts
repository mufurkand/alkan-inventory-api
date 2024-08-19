import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VALIDATION_PIPE_OPTIONS } from './common/constants/common.constants';
import { Decimal } from '@prisma/client/runtime/library';

async function bootstrap() {
  // override the toJSON method of Decimal to return a number instead of a fucking string
  Decimal.prototype.toJSON = function () {
    return this.toNumber();
  };
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.enableCors();
  await app.listen(3456);
}
bootstrap();
