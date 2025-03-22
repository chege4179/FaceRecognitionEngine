import {HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectAws} from "aws-sdk-v3-nest";
import {DeleteFacesCommand, DeleteFacesCommandInput, RekognitionClient} from "@aws-sdk/client-rekognition";
import {AppConfig} from "../util/appConfig";
import {ErrorMapping} from "../config/ErrorMapping";
import {CommonFunction} from "../util/CommonFunction";
import {AppConfiguration} from "../../app/app.configuration";



@Injectable()
export class RekognitionRepositoryService{
    constructor(
        @InjectAws(RekognitionClient)
        private readonly rekognitionClient: RekognitionClient,
        private readonly commonFunction: CommonFunction,
        private readonly appConfiguration: AppConfiguration,
    ) {


    }

    async deleteImageFromRecognition(faceId:string) {
        try {
            const request: DeleteFacesCommandInput = {
                CollectionId: AppConfig.FACE_COLLECTION_ID,
                FaceIds: [faceId]
            }
            const command = new DeleteFacesCommand(request)
            const response = await this.rekognitionClient.send(command)
            if (response.$metadata.httpStatusCode === HttpStatus.OK) {
                if (response?.DeletedFaces?.length === 0) {
                    await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_NOT_FOUND)
                }
            } else {
                await this.commonFunction.errorResponseMapping(ErrorMapping.DELETE_FACE_FAILED)
            }
        }catch (error) {
            if (this.appConfiguration.environment === "development") {
                Logger.error(error)
            }
        }
    }
}