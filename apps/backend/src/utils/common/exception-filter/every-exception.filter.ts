import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Catch()
export class EveryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const next = host.switchToHttp().getNext<NextFunction>();

    if (exception instanceof HttpException) {
      return next(exception);
    }

    res.status(501).json({
      code: 'Internal server error',
      error: {
        message: 'Internal server error',
      },
    });
  }
}
