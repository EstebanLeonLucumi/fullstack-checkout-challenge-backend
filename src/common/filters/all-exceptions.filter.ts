import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Messages } from '../utils/messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.getStatusAndMessage(exception, request);

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${statusCode} - ${exception instanceof Error ? exception.message : String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json({
      statusCode,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }

  private getStatusAndMessage(
    exception: unknown,
    request: Request,
  ): { statusCode: number; message: string } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const raw =
        typeof response === 'string'
          ? response
          : typeof response === 'object' && response !== null && 'message' in response
            ? (response as { message?: string | string[] }).message
            : undefined;
      const message = Array.isArray(raw)
        ? raw[0]
        : typeof raw === 'string'
          ? raw
          : this.getDefaultMessage(status);
      return { statusCode: status, message };
    }

    if (exception instanceof Error) {
      const isDev = process.env.NODE_ENV !== 'production';
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: isDev ? exception.message : Messages.INTERNAL_ERROR,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: Messages.INTERNAL_ERROR,
    };
  }

  private getDefaultMessage(status: number): string {
    const messages: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: Messages.BAD_REQUEST,
      [HttpStatus.UNAUTHORIZED]: Messages.UNAUTHORIZED,
      [HttpStatus.FORBIDDEN]: Messages.FORBIDDEN,
      [HttpStatus.NOT_FOUND]: Messages.NOT_FOUND,
      [HttpStatus.CONFLICT]: Messages.CONFLICT,
      [HttpStatus.UNPROCESSABLE_ENTITY]: Messages.UNPROCESSABLE_ENTITY,
      [HttpStatus.INTERNAL_SERVER_ERROR]: Messages.INTERNAL_ERROR,
    };
    return messages[status] ?? Messages.INTERNAL_ERROR;
  }
}
