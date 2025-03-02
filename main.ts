import {NestFactory} from '@nestjs/core';
import {AppModule} from './src/app/app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {LoggerTags} from "./src/shared/util/appConfig";
import { NestExpressApplication } from '@nestjs/platform-express';
import {LoggingInterceptor} from "./src/shared/interceptor/logging.interceptor";


const port = process.env.PORT ?? 3000

async function bootstrap() {
    process.env.TZ = 'Africa/Nairobi';
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    await app.startAllMicroservices();
    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useBodyParser('json', { limit: '50mb' })

    await app.listen(port);


}

bootstrap()
    .then(() => {
        Logger.log(`🚀🚀🚀🚀 Face Recognition API Service running at port ${port}`, LoggerTags.BOOT_STRAPPING);
    })
    .catch((error) => {
        Logger.error(error,LoggerTags.BOOT_STRAPPING)
        Logger.error(`Failed to start Face Recognition API Service`, LoggerTags.BOOT_STRAPPING);
    })
