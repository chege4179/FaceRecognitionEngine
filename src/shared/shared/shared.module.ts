import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {HttpModule} from "@nestjs/axios";
import {TypeOrmModule} from "@nestjs/typeorm";
import {FaceEntity} from "../entity/face.entity";
import {CommonFunction} from "../util/CommonFunction";
import {AwsSdkModule} from "aws-sdk-v3-nest";
import {RekognitionClient} from "@aws-sdk/client-rekognition";
import {CloudinaryRepositoryService} from "../repository/cloudinary-repository.service";
import {FaceRepositoryService} from "../repository/face-repository.service";
import {CloudinaryModule} from "nestjs-cloudinary";
import {RekognitionRepositoryService} from "../repository/rekognition-repository.service";


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
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const dbUrl = configService.get<string>('DATABASE_URL')
                const shouldSynchronize = configService.get("NODE_ENV") !== "production"
                return {
                    type: 'mysql',
                    url: dbUrl,
                    synchronize: false,
                    entities: ['dist/src/shared/entity/*.entity.{js,ts}'],
                    logging: ["error"],
                }
            },
        }),
        CloudinaryModule.forRootAsync({
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
        AwsSdkModule.registerAsync({
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
        CloudinaryRepositoryService,
        FaceRepositoryService,
        RekognitionRepositoryService,
    ],
    exports: [
        ConfigModule,
        HttpModule,
        EventEmitterModule,
        TypeOrmModule,
        CommonFunction,
        AwsSdkModule,
        CloudinaryRepositoryService,
        FaceRepositoryService,
        RekognitionRepositoryService,
    ]
})
export class SharedModule {
}