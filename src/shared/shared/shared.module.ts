import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FaceEntity} from "../entity/face.entity";
import {CommonFunction} from "../util/CommonFunction";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        EventEmitterModule.forRoot({
            global: true
        }),
        TypeOrmModule.forFeature([FaceEntity]),
        HttpModule.register({
            maxRedirects: 2,
        }),
    ],
    providers: [
        CommonFunction,
    ],
    exports: [
        ConfigModule,
        HttpModule,
        EventEmitterModule,
        TypeOrmModule,
        CommonFunction,
    ]
})
export class SharedModule {
}