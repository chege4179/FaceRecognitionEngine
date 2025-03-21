import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger,} from '@nestjs/common';
import {LoggerTags} from "../util/appConfig";


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        const statusCode = exception.getStatus()
        const errorResponse = exception.getResponse();


        if (request.ip){
            Logger.error(`(${request.ip}) ${request.method} ${request.url}  ${JSON.stringify(errorResponse)}`,
                LoggerTags.EXCEPTION_FILTER
            );
        }else {
            Logger.error(`${request.method} ${request.url}  ${JSON.stringify(errorResponse)}`,
                LoggerTags.EXCEPTION_FILTER
            );
        }

        response.status(statusCode).json(errorResponse);
    }
}

