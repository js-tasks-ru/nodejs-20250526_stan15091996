import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message: string = 'Correct your request';

    if (exception instanceof mongoose.Error.ValidationError) {
      message = 'Validation error message';
    } else {
      message = 'Duplicate key error';
    }

    response.status(400).json({
      error: "Bad Request",
      statusCode: 400,
      message: message,
    });
  }
}
