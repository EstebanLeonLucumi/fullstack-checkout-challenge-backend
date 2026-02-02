import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new RequestLoggingInterceptor(),
    new ApiResponseInterceptor(),
  );

  const corsOrigin = process.env.CORS_ORIGIN;
  const origins = corsOrigin
    ? corsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
    : true;
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
