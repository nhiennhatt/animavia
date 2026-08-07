import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';
import { NextFunction, Response } from 'express';

@Catch()
export class EveryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(EveryExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const next = host.switchToHttp().getNext<NextFunction>();

    if (exception instanceof HttpException) {
      return next(exception);
    }

    this.logger.error(
      exception.name,
      exception.message,
      exception.stack,
      exception.cause,
    );

    res.status(501).json({
      code: 'Internal server error',
      error: {
        message: 'Internal server error',
      },
    });
  }
}
