import {BadRequestException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {FaceEntity} from "../../shared/entity/face.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CaptureFaceDetailsDto} from "src/shared/dto/capture-face-details-dto";
import {CommonFunction} from "../../shared/util/CommonFunction";
import {InjectAws} from "aws-sdk-v3-nest";
import {ErrorMapping} from "src/shared/config/ErrorMapping";
import {
    DeleteFacesCommand,
    DeleteFacesCommandInput,
    DescribeCollectionCommand,
    DetectFacesCommand,
    DetectFacesRequest,
    IndexFacesCommand,
    IndexFacesCommandInput,
    ListFacesCommand,
    RekognitionClient,
    SearchFacesByImageCommand,
    SearchFacesByImageCommandInput
} from "@aws-sdk/client-rekognition";
import {AppConfig} from "../../shared/util/appConfig";
import {DeleteFaceDto} from "../../shared/dto/delete-face-dto";
import {CloudinaryRepositoryService} from "../../shared/cloudinary/cloudinary-repository.service";
import {FaceRepositoryService} from "../../shared/repository/face-repository.service";


@Injectable()
export class FaceService {

    constructor(
        @InjectRepository(FaceEntity)
        private readonly faceRepository: Repository<FaceEntity>,
        private readonly cloudinaryRepository: CloudinaryRepositoryService,
        private readonly faceRepositoryService: FaceRepositoryService,
        private readonly commonFunction: CommonFunction,
        @InjectAws(RekognitionClient)
        private readonly rekognitionClient: RekognitionClient
    ) {
    }


    async getAllSavedFaces() {
        try {
            const listFaceCollectionsCommand = new ListFacesCommand({
                CollectionId: AppConfig.FACE_COLLECTION_ID,
            })

            const userData = await this.faceRepository.find()
            const faces = await this.rekognitionClient.send(listFaceCollectionsCommand)
            const facesData = userData.map(user => {
                return {
                    ...user,
                    faceVectorDetails:faces?.Faces?.find(face => face.FaceId === user.faceId)
                }
            })
            return {
                faces: facesData,
            }
        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e);
        }

    }


    async captureFaceDetails(payload: CaptureFaceDetailsDto, file: Express.Multer.File) {
        const collectionArn = "aws:rekognition:us-east-1:491085424971:collection/faces"
        await this.faceRepositoryService.validateIdNoNotDuplicated(payload)

        const detectFacesRequest: DetectFacesRequest = {
            Image: {
                Bytes: file.buffer,
            },
            Attributes: ['ALL'],
        };
        const detectFacesCommand: DetectFacesCommand = new DetectFacesCommand(
            detectFacesRequest,
        );
        const response = await this.rekognitionClient.send(detectFacesCommand);

        if (response) {
            if (response.$metadata.httpStatusCode === HttpStatus.OK) {
                if (response.FaceDetails && response.FaceDetails.length > 0) {
                    const faceCount = response.FaceDetails.length
                    Logger.log(`No of Faces detected ${faceCount}`,);
                    if (faceCount < 2) {
                        const faceDetails = response.FaceDetails[0];

                        const searchFacesRequest: SearchFacesByImageCommandInput = {
                            CollectionId: AppConfig.FACE_COLLECTION_ID,
                            MaxFaces: 1,
                            FaceMatchThreshold: 95,
                            Image: {
                                Bytes: file.buffer,
                            }
                        }
                        const command = new SearchFacesByImageCommand(searchFacesRequest)
                        const searchResult = await this.rekognitionClient.send(command)
                        if (searchResult) {
                            const faceMatches = searchResult.FaceMatches
                            if (faceMatches) {
                                if (faceMatches.length === 0) {
                                    const indexFacesRequest: IndexFacesCommandInput = {
                                        CollectionId: "faces",
                                        MaxFaces: 1,
                                        Image: {
                                            Bytes: file.buffer,
                                        },
                                    }
                                    const command = new IndexFacesCommand(indexFacesRequest)
                                    const result = await this.rekognitionClient.send(command)
                                    if (result) {
                                        const uploadCloudinaryResult = await this.cloudinaryRepository.uploadImage(file)
                                        if (uploadCloudinaryResult) {
                                            const faceId = this.commonFunction.getFaceId(result);
                                            const newFaceEntity = new FaceEntity();
                                            newFaceEntity.imageUrl = uploadCloudinaryResult.imageUrl
                                            newFaceEntity.idNo = payload.idNo
                                            newFaceEntity.name = payload.name
                                            newFaceEntity.imageId = uploadCloudinaryResult.imageId
                                            newFaceEntity.faceId = faceId
                                            newFaceEntity.dateCreated = new Date()
                                            newFaceEntity.dateUpdated = new Date()

                                            const dbResult = await this.faceRepository.save(newFaceEntity)

                                            return {
                                                msg: "Face created successfully",
                                                face: dbResult
                                            }
                                        } else {
                                            await this.commonFunction.errorResponseMapping(ErrorMapping.CDN_ERROR)
                                        }
                                    } else {
                                        await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_NOT_CAPTURED)
                                    }
                                } else {
                                    await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_EXISTS)
                                }
                            } else {
                                await this.commonFunction.errorResponseMapping(ErrorMapping.SEARCH_FACES_FAILED)
                            }

                        } else {
                            await this.commonFunction.errorResponseMapping(ErrorMapping.SEARCH_FACES_FAILED)
                        }
                    } else {

                        await this.commonFunction.errorResponseMapping(ErrorMapping.MULTIPLE_FACES_DETECTED)
                    }
                } else {
                    await this.commonFunction.errorResponseMapping(ErrorMapping.NO_FACE_DETECTED)
                }
            } else {
                await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_DETECTION_FAILED);
            }
        } else {
            await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_DETECTION_FAILED)
        }
    }


    async queryFaceMatches(file: Express.Multer.File) {
        try {
            const command = new SearchFacesByImageCommand({
                CollectionId: AppConfig.FACE_COLLECTION_ID,
                Image: {
                    Bytes: file.buffer,
                },
                MaxFaces: 1,
                FaceMatchThreshold: 95
            })
            const result = await this.rekognitionClient.send(command)
            if (result) {
                const matches = result.FaceMatches

                if (matches && matches.length > 0) {
                    const firstMatchFaceId = matches[0]?.Face
                    const user = await this.faceRepositoryService.findUserByFaceID(firstMatchFaceId?.FaceId || "")
                    if (user){
                        return {
                            msg: "User found",
                            user: user,
                        }
                    }else {
                        await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_DETAILS_NOT_FOUND)
                    }
                } else {
                    await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_SEARCH_NOT_FOUND)
                }
            }
        }catch (error) {
            await this.commonFunction.errorResponseMapping({
                message:error.response.message,
                code:error.response.error,
            });
        }
    }


    async deleteFaces(payload: DeleteFaceDto) {
        try {
            const request: DeleteFacesCommandInput = {
                CollectionId: AppConfig.FACE_COLLECTION_ID,
                FaceIds: [payload.faceId]
            }
            const command = new DeleteFacesCommand(request)
            const response = await this.rekognitionClient.send(command)
            if (response.$metadata.httpStatusCode === HttpStatus.OK) {
                if (response?.DeletedFaces?.length === 0) {
                    await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_NOT_FOUND)
                } else {
                    this.commonFunction.successResponse("Face deleted successfully")
                }
            } else {
                await this.commonFunction.errorResponseMapping(ErrorMapping.DELETE_FACE_FAILED)
            }

        } catch (error) {
            Logger.error(error);
            await this.commonFunction.errorResponseMapping(error)
        }
    }


}