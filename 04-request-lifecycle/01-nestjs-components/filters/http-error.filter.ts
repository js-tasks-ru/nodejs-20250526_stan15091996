import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';
import {appendFileSync} from 'fs';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception:  HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    console.log(exception);
    const timestamp = new Date().toISOString();

    appendFileSync('./errors.logs', `[${timestamp} ${status}] - ${message}`);

    response
      .status(status)
      .json({
        statusCode: status,
        message: "Mock error for testing",
        timestamp: timestamp,
      });
  }
}
