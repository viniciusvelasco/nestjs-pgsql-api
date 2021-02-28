import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, user } = request;
    const userAgent = request.get('user-agent') || '';
    console.log(user);
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      if (statusCode === 401) {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}
