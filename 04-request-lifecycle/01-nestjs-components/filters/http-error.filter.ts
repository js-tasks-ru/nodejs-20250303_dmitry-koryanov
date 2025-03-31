import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

import { Response } from "express";
import * as fs from "node:fs";
import { ERROR_LOG_FILE_PATH } from "../configs/config";

@Catch(Error)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const now = new Date().toISOString();
    const message = exception.message;
    let statusCode = 500;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
    }

    response.status(statusCode).json({
      message: message,
      statusCode: statusCode,
      timestamp: now,
    });

    fs.appendFileSync(
      ERROR_LOG_FILE_PATH,
      `[${now}] ${statusCode} - ${message}\n`,
    );
  }
}
