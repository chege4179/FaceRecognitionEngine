import {BadRequestException, Injectable, Logger} from "@nestjs/common";
import {FaceEntity} from "../../shared/entity/face.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CaptureFaceDetailsDto} from "src/shared/dto/capture-face-details-dto";
import {CommonFunction} from "../../shared/util/CommonFunction";
import {QueryFaceDto} from "../../shared/dto/queryFace-dto";
import {CreateCollectionCommand, RekognitionClient} from "@aws-sdk/client-rekognition";
import {InjectAws} from "aws-sdk-v3-nest";



@Injectable()
export class FaceService {

    constructor(
        @InjectRepository(FaceEntity)
        private readonly faceRepository: Repository<FaceEntity>,
        private readonly commonFunction: CommonFunction,

        @InjectAws(RekognitionClient)
        private readonly rekognitionClient:RekognitionClient
    ) {
    }


    async getAllSavedFaces() {
        try {
            const faces = await this.faceRepository.find()
            return {
                faces: faces,
            }
        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e);
        }

    }


    async captureFaceDetails(payload: CaptureFaceDetailsDto, file: Express.Multer.File) {
        try {



        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e);
        }
    }


    async queryFaceMatches(payload: QueryFaceDto) {
        try {

        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e)
        }

    }



    async createCollection(){
        try {
            const input = {
                "CollectionId": "faces"
            };
            const command = new CreateCollectionCommand(input);
            const response = await this.rekognitionClient.send(command);
            return { response: response };
        }catch (e){
            Logger.error(e);
            throw new BadRequestException(e);
        }
    }
}