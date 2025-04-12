import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (
      exception instanceof mongoose.Error.ValidationError ||
      exception instanceof mongoose.mongo.MongoError
    ) {
      const status = 400;

      const errorMessage = exception.message;

      response.status(status).json({
        statusCode: status,
        error: "Bad Request",
        message: errorMessage,
      });
    }
  }
}
