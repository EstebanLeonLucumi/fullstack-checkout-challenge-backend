import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Messages } from '../utils/http-messages';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request & { method: string; url: string }>();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as
      | string
      | { message?: string | string[]; error?: string };

    const rawMessage = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : Array.isArray(exceptionResponse?.message)
        ? exceptionResponse.message[0]
        : exceptionResponse?.message;

    const message = rawMessage || this.getDefaultMessage(status);

    this.logger.error(
      `HTTP ${status} ${request.method} ${request.url} - ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      data: null,
      timestamp: new Date(),
    });
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case 404:
        return Messages.PRODUCT_NOT_FOUND;
      case 409:
        return Messages.EMAIL_ALREADY_EXISTS;
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      default:
        return 'An error occurred';
    }
  }
}
