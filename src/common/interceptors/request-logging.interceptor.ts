import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { body?: Record<string, unknown> }>();
    const response = ctx.getResponse<{ statusCode: number }>();
    const { method, url, body } = request;
    const start = Date.now();

    const bodyLog =
      body && ['POST', 'PUT', 'PATCH'].includes(method)
        ? ` body=${JSON.stringify(this.sanitize(body))}`
        : '';
    console.log(
      `[Request] ${method} ${url}${bodyLog}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          console.log(
            `[Response] ${method} ${url} ${response.statusCode} ${duration}ms`,
          );
        },
        error: (err) => {
          const duration = Date.now() - start;
          console.error(
            `[Response Error] ${method} ${url} ${err?.status ?? 500} ${duration}ms - ${err?.message ?? err}`,
          );
        },
      }),
    );
  }

  private sanitize(obj: Record<string, unknown>): Record<string, unknown> {
    const sensitive = ['password', 'cvc', 'private', 'secret'];
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const key = k.toLowerCase();
      if (sensitive.some((s) => key.includes(s))) {
        out[k] = '***';
      } else {
        out[k] = v;
      }
    }
    return out;
  }
}
