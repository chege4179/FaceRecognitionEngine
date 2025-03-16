import {Injectable, Logger} from "@nestjs/common";
import {CommonFunction} from "../util/CommonFunction";
import {CloudinaryService} from "nestjs-cloudinary";

@Injectable()
export class CloudinaryRepositoryService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly commonFunction: CommonFunction,
    ) {
    }


    async uploadImage(file: Express.Multer.File) {
        try {
            const imageUploadResponse = await this.cloudinaryService.uploadFile(file, {
                resource_type: "image",
                public_id: `cinch/${file.originalname}`,
                chunk_size: 6000000,
                eager_async: true,
            })
            return {
                imageUrl:imageUploadResponse.secure_url,
                imageId: imageUploadResponse.public_id,
            }
        }catch (error) {
            await this.commonFunction.errorResponseMapping(error)
        }

    }

    async deleteImageById(imageId:string){
        try {
            const result = await this.cloudinaryService.cloudinary.api.delete_resources([imageId]);


        }catch (error) {
            Logger.error(error);
            await this.commonFunction.errorResponseMapping(error)
        }

    }
}