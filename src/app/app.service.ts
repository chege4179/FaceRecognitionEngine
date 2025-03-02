import {BadRequestException, Body, Injectable, Logger} from '@nestjs/common';
import {ImageUrlDto} from "../shared/dto/imageUrl-dto";
import {HttpService} from "@nestjs/axios";
import {catchError, firstValueFrom} from "rxjs";
import {AxiosError} from "axios";
import {Repository} from "typeorm";
import {FaceEntity} from "../shared/entity/face.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {testData} from "../shared/util/testData";


@Injectable()
export class AppService {
    constructor(
        private readonly httpService: HttpService,

        @InjectRepository(FaceEntity)
        private readonly faceRepository:Repository<FaceEntity>
    ) {

    }

    getHello(): string {
        return 'Hello World!';
    }


    async getImageUrlBase64(@Body() payload: ImageUrlDto) {
        try {
            const base64Image = await this.getImageBase64(payload.imageUrl);
            return base64Image
        } catch (e) {
            console.error(e);
            throw new BadRequestException(e.message);
        }


    }

    async getImageBase64(imageUrl: string) {
        try {
            const {data} = await firstValueFrom(
                this.httpService.get(imageUrl, {
                    responseType: "arraybuffer",
                }).pipe(
                    catchError((error: AxiosError) => {
                        throw new BadRequestException(error.message)

                    }),
                ),
            );
            const base64Image = Buffer.from(data, 'binary').toString('base64')
            return base64Image
        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e.message);
        }
    }

    async seedData(){
        try {
            await this.faceRepository.clear()

            const faceEntitys = testData.data.map((data) => {
                const faceEntity = new FaceEntity();
                faceEntity.name = data.name;
                faceEntity.faceEmbeddings = data.faceprint
                faceEntity.idNo = data.id.toString()
                faceEntity.imageUrl = data.name
                return faceEntity;
            })
            const result = await this.faceRepository.save(faceEntitys)
            return {
                faces: result,
            }
        }catch (error){
            Logger.error(error);
            throw new BadRequestException(error.message);
        }
    }
}
