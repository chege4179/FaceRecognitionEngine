import {IsDefined, IsNotEmpty, IsUUID} from "@nestjs/class-validator";


export class DeleteFaceDto{

    @IsUUID()
    @IsNotEmpty()
    @IsDefined()
    faceId:string

}