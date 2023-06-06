import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middleware/logger.middleware';
import { AuthGuard } from './auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // [INFO] 전역 가드 사용 시
  // app.useGlobalGuards(new AuthGuard());
  app.use(loggerMiddleware);
  await app.listen(3000);
}
bootstrap();
