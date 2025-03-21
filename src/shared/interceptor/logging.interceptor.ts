import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const req = context.switchToHttp().getRequest();
        return next.handle().pipe(
            tap(() => {
                if (req.ip) {
                    Logger.log(
                        `IP Address: ${req.ip} ,${req.method} ${req.url} : ${Date.now() - now}ms,`,
                        context.getClass().name,
                    );
                } else if (req.method || req.url) {
                    Logger.log(
                        `${req.method} ${req.url} : ${Date.now() - now}ms`,
                        context.getClass().name,
                    );
                }
            }),
        );
    }
}
