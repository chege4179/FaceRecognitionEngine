import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SharedModule} from "../shared/shared/shared.module";
import {HttpExceptionFilter} from "../shared/filter/http.filter";
import {APP_FILTER} from "@nestjs/core";
import {FaceModule} from "../features/face/face.module";

@Module({
    imports: [
        SharedModule,
        FaceModule,
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
