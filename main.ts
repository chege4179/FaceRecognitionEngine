import {NestFactory} from '@nestjs/core';
import {AppModule} from './src/app/app.module';
import {Logger} from "@nestjs/common";
import {LoggerTags} from "./src/shared/util/appConfig";


const PORT = process.env.PORT ?? 3000

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT);
}

bootstrap()
    .then(() => {
        Logger.log(`🚀🚀🚀🚀 Face Recognition API Service running at port ${PORT}`, LoggerTags.BOOT_STRAPPING);
    })
    .catch(() => {
        Logger.error(`Failed to start Blogger API Service`, LoggerTags.BOOT_STRAPPING);
    })
