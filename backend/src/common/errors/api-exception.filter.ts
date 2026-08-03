import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = exception instanceof HttpException ? exception.getResponse() : undefined;
    const detail = typeof payload === 'object' && payload ? payload as Record<string, unknown> : {};
    const message = typeof payload === 'string'
      ? payload
      : Array.isArray(detail.message) ? 'Validation failed' : String(detail.message ?? 'Internal server error');

    response.status(status).json({
      success: false,
      message,
      code: String(detail.error ?? HttpStatus[status]).toUpperCase().replaceAll(' ', '_'),
      errors: Array.isArray(detail.message)
        ? detail.message.map((item) => ({ message: String(item) }))
        : undefined,
      meta: { requestId: request.requestId },
    });
  }
}
