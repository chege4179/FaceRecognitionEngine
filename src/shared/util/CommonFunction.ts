import {BadRequestException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {SuccessResponse} from "../config/successResponse";
import {ErrorsCheckDto} from "../config/error-checks-dto";
import {IndexFacesCommandOutput} from "@aws-sdk/client-rekognition";
import {ErrorMapping} from "../config/ErrorMapping";

@Injectable()
export class CommonFunction {


    errorResponse(errorDescription: string, errorCode: string | null = null) {
        if (errorCode) {
            throw new BadRequestException(errorDescription, errorCode);
        } else {
            throw new BadRequestException(errorDescription);
        }

    }

    async errorResponseMapping(payload: ErrorsCheckDto): Promise<any> {
        throw new BadRequestException(payload.message, {
            cause: new Error(),
            description: payload.code,
        });
    }

    successResponse(message: string) {
        return new SuccessResponse(HttpStatus.OK, message);
    }

    successCreatedResponse(message: string) {
        return new SuccessResponse(HttpStatus.CREATED, message)
    }

    getFaceId(data: IndexFacesCommandOutput): string {
        if (data.FaceRecords && data.FaceRecords.length > 0 ) {
            if (data.FaceRecords[0].Face) {
                if (data.FaceRecords[0].Face.FaceId){
                    return data.FaceRecords[0].Face.FaceId
                }else {
                    throw new BadRequestException(ErrorMapping.FACE_ID_NOT_FOUND);
                }
            }else {
                throw new BadRequestException(ErrorMapping.FACE_ID_NOT_FOUND);
            }
        }else {
            throw new BadRequestException(ErrorMapping.FACE_ID_NOT_FOUND);
        }
    }
}