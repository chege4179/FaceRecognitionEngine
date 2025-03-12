import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FaceEntity} from "../entity/face.entity";
import {CommonFunction} from "../util/CommonFunction";
import {AwsSdkModule} from "aws-sdk-v3-nest";
import {RekognitionClient} from "@aws-sdk/client-rekognition";


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
        AwsSdkModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            clientType: RekognitionClient,
            useFactory: (configService: ConfigService) => {
                return new RekognitionClient({
                    region: "us-east-1",
                    credentials: {
                        accessKeyId: configService.getOrThrow<string>("AWS_ACCESS_KEY_ID"),
                        secretAccessKey: configService.getOrThrow<string>("AWS_SECRET_ACCESS_KEY"),
                    },
                })
            },
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
        AwsSdkModule,
    ]
})
export class SharedModule {
}