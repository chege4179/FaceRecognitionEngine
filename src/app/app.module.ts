import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SharedModule} from "../shared/shared/shared.module";
import {HttpExceptionFilter} from "../shared/filter/http.filter";
import {APP_FILTER} from "@nestjs/core";
import {FaceModule} from "../features/face/face.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";
import {CloudinaryModule} from "nestjs-cloudinary";

@Module({
    imports: [
        SharedModule,
        FaceModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const dbUrl = configService.get<string>('DATABASE_URL')
                return {
                    type: 'mysql',
                    url: dbUrl,
                    synchronize: true,
                    entities: ['dist/src/shared/entity/*.entity.{js,ts}'],
                    logging: ["error"],
                }
            },
        }),
        CloudinaryModule.forRootAsync({
            imports: [SharedModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    isGlobal: true,
                    cloud_name: configService.get('CLOUD_NAME'),
                    api_key: configService.get('CLOUDINARY_API_KEY'),
                    api_secret: configService.get('CLOUDINARY_API_SECRET'),
                }
            }
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {
}
