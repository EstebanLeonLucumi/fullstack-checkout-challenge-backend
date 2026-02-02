import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Messages } from './common/utils/messages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((e) =>
          e.constraints ? Object.values(e.constraints).join(', ') : e.property,
        );
        return new BadRequestException(
          messages.length ? messages[0] : Messages.VALIDATION_FAILED,
        );
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
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
