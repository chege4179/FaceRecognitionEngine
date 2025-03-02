import {IsDefined, IsNotEmpty} from "@nestjs/class-validator";


export class CaptureFaceDetailsDto{

    @IsNotEmpty()
    @IsDefined()
    idNo:string


    @IsNotEmpty()
    @IsDefined()
    name:string


    @IsNotEmpty()
    @IsDefined()
    faceEmbedding:string


}