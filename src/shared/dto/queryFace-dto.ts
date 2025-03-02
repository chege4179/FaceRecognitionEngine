import {IsDefined, IsNotEmpty} from "@nestjs/class-validator";


export class QueryFaceDto {

    @IsNotEmpty()
    @IsDefined()
    faceEmbedding:string
}