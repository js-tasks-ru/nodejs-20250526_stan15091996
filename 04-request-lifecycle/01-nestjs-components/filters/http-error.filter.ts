import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';
import {appendFileSync} from 'fs';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception:  HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;
    console.log(exception);
    const timestamp = new Date().toISOString();

    appendFileSync('errors.log', `[${timestamp}] ${status} - ${message}\n`);

    response
      .status(status)
      .json({
        statusCode: status,
        message: message,
        timestamp: timestamp,
      });
  }
}
