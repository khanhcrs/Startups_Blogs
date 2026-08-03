import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((result: unknown) => {
        if (result && typeof result === 'object' && 'success' in result) return result;
        const value = result as { data?: unknown; meta?: Record<string, unknown>; message?: string } | undefined;
        return {
          success: true,
          message: value?.message,
          data: value?.data ?? result ?? null,
          meta: { ...(value?.meta ?? {}), requestId: request.requestId },
        };
      }),
    );
  }
}
