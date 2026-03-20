import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { RollbarService } from '@/shared/infrastructure/rollbar/rollbar.service';
import { BusinessLogicError } from '@/shared/domain/errors/business-logic.error';
import { SystemError } from '@/shared/domain/errors/system.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(RollbarService) private readonly rollbarService: RollbarService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof BusinessLogicError) {
      status = exception.statusCode;
      message = exception.message;

      this.rollbarService.logBusinessLogicError(message, {
        action: `${request.method} ${request.path}`,
        userId: request.user?.id,
        statusCode: status,
      });
    } else if (exception instanceof SystemError) {
      status = exception.statusCode;
      message = exception.message;

      this.rollbarService.logSystemError(exception, {
        action: `${request.method} ${request.path}`,
        userId: request.user?.id,
        statusCode: status,
      });
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'object'
          ? (errorResponse as unknown as { message?: string }).message ||
            exception.message
          : exception.message;

      // Only log 5xx errors from HttpException
      if (status >= 500) {
        this.rollbarService.logSystemError(exception, {
          action: `${request.method} ${request.path}`,
          userId: request.user?.id,
          statusCode: status,
        });
      }
    } else if (exception instanceof Error) {
      this.rollbarService.logSystemError(exception, {
        action: `${request.method} ${request.path}`,
        userId: request.user?.id,
        errorType: 'unknown_error',
      });
    } else {
      this.rollbarService.logSystemError(String(exception), {
        action: `${request.method} ${request.path}`,
        userId: request.user?.id,
        errorType: 'unknown_error',
      });
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
