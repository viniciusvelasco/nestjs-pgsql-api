import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Logger } from 'winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //this.log(context.switchToHttp().getRequest());
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const start = Date.now();
    const { originalUrl, method, params, query, body, user } = req;
    return next.handle().pipe(
      map((value) => {
        const t = this.teste(value);
        const stop = Date.now().toLocaleString();
        console.log({
          t,
          start,
          statusCode,
          originalUrl,
          method,
          params,
          query,
          body,
          user,
          stop,
        });
        return value;
      }),
      catchError((error) => {
        console.log({ error });
        const t = this.teste(error.response);
        const stop = Date.now().toLocaleString();
        const statusCodeError = error.response.statusCode;
        console.log({
          t,
          start,
          statusCodeError,
          originalUrl,
          method,
          params,
          query,
          body,
          user,
          stop,
        });
        return throwError(error);
      }),
    );
  }

  private teste(value) {
    return JSON.stringify(value);
  }

  private log(req) {
    const body = { ...req.body };
    delete body.password;
    delete body.passwordConfirmation;
    const user = (req as any).user;
    const userEmail = user ? user.email : null;
    this.logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.route.path,
      data: {
        body: body,
        query: req.query,
        params: req.params,
      },
      from: req.ip,
      madeBy: userEmail,
    });
  }
}
