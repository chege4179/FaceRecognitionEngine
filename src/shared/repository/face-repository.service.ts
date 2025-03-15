import {FaceEntity} from "../entity/face.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CaptureFaceDetailsDto} from "../dto/capture-face-details-dto";
import {CommonFunction} from "../util/CommonFunction";
import {ErrorMapping} from "../config/ErrorMapping";
import {Logger} from "@nestjs/common";


export class FaceRepositoryService {
    constructor(
        @InjectRepository(FaceEntity)
        private readonly faceRepository: Repository<FaceEntity>,
        private readonly commonFunction: CommonFunction,
    ) {
    }

    async validateIdNoNotDuplicated(payload: CaptureFaceDetailsDto): Promise<any> {
        const existingFaceDetails = await this.faceRepository.findOne(
            {where: {idNo: payload.idNo}}
        )
        if (existingFaceDetails) {
            await this.commonFunction.errorResponseMapping(ErrorMapping.ID_ALREADY_EXISTS);
        }
    }

    async findUserByFaceID(faceId: string) {
        try {
            const face = await this.faceRepository.findOne({
                where: { faceId: faceId },
            })
            if (face) {
                return face;
            }else {
                await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_DETAILS_NOT_FOUND)
            }
            return
        } catch (error) {
            Logger.error(error);
            await this.commonFunction.errorResponseMapping(ErrorMapping.FACE_DETAILS_NOT_FOUND)
        }
    }
}