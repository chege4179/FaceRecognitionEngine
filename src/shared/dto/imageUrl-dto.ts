import {IsDefined, IsNotEmpty, IsUrl} from "@nestjs/class-validator";


export class ImageUrlDto {


    @IsUrl()
    @IsNotEmpty()
    @IsDefined()
    imageUrl: string;

}