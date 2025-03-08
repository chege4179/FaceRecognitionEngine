import {BadRequestException, Injectable, Logger} from "@nestjs/common";
import {FaceEntity} from "../../shared/entity/face.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CaptureFaceDetailsDto} from "src/shared/dto/capture-face-details-dto";
import {CommonFunction} from "../../shared/util/CommonFunction";
import {QueryFaceDto} from "../../shared/dto/queryFace-dto";

// fhfhfh

@Injectable()
export class FaceService {

    constructor(
        @InjectRepository(FaceEntity)
        private readonly faceRepository: Repository<FaceEntity>,
        private readonly commonFunction: CommonFunction,
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
            const existingFace = await this.faceRepository.findOne({
                where: {
                    idNo: payload.idNo
                }
            })
            if (existingFace) {
                return this.commonFunction.errorResponse(
                    "This user already exists",
                    "FACE_EXISTS"
                )
            }

            const newFace = new FaceEntity()
            newFace.idNo = payload.idNo
            newFace.name = payload.name
            newFace.faceEmbeddings = payload.faceEmbedding


        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e);
        }
    }


    async queryFaceMatches(payload: QueryFaceDto) {
        try {
            const formattedFaceEmbedding = this.commonFunction.stringToNumberArray(payload.faceEmbedding)
            const allFaces = await this.faceRepository.find()

            const facesWithEmbedding = allFaces.map(face => {
                const formattedStoredEmbedding = this.commonFunction.stringToNumberArray(face.faceEmbeddings)
                return {
                    ...face,
                    distance: this.euclideanDistance(formattedStoredEmbedding, formattedFaceEmbedding)
                }
            }).sort((a, b) => a.distance - b.distance);


            return {result: facesWithEmbedding}
        } catch (e) {
            Logger.error(e);
            throw new BadRequestException(e)
        }

    }

    euclideanDistance(vectorA: number[], vectorB: number[]) {
        if (vectorA.length !== vectorB.length) {
            throw new Error('Vectors must have the same length');
        }

        let sum = 0;
        for (let i = 0; i < vectorA.length; i++) {
            sum += Math.pow(vectorA[i] - vectorB[i], 2);
        }

        return Math.sqrt(sum);
    }

    cosineSimilarity(vectorA: number[], vectorB: number[]): number {
        if (vectorA.length !== vectorB.length) {
            throw new Error('Vectors must have the same length');
        }

        // Calculate the dot product of A and B
        let dotProduct = 0;
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
        }

        // Calculate the magnitude (Euclidean norm) of A
        let magnitudeA = 0;
        for (const value of vectorA) {
            magnitudeA += value * value;
        }
        magnitudeA = Math.sqrt(magnitudeA);

        // Calculate the magnitude (Euclidean norm) of B
        let magnitudeB = 0;
        for (const value of vectorB) {
            magnitudeB += value * value;
        }
        magnitudeB = Math.sqrt(magnitudeB);

        // Calculate cosine similarity
        if (magnitudeA === 0 || magnitudeB === 0) {
            throw new Error('One of the vectors has zero magnitude');
        }

        return dotProduct / (magnitudeA * magnitudeB);
    }

}