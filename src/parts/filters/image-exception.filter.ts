import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch()
export class ImageExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Get the image path from the request
    const imagePath = request.file?.path;

    // Delete the image if it exists
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        }
      });
    }

    switch (exception.code) {
      case 'P2002':
        response.status(400).json({
          statusCode: 400,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: 'Bad Request',
          message: `unique constraint violation`,
          target: exception.meta.target,
        });
        break;

      default:
        const status =
          exception instanceof HttpException ? exception.getStatus() : 500;

        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: exception.response.error || 'Internal server error',
          message: exception.response.message || 'Internal server error',
        });
        break;
    }
  }
}
