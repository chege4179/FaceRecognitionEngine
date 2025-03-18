import {BadRequestException, Injectable, Logger, PipeTransform} from "@nestjs/common";
import {loadEsm} from 'load-esm';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    async transform(value: Express.Multer.File) {

        const { fileTypeFromBuffer } = await loadEsm<typeof import('file-type')>('file-type')

        const result = await fileTypeFromBuffer(value.buffer)

        Logger.log(`MIME received ${result.mime}`,"FileTypeValidationPipe")
        if (result){
            const MIME_TYPES = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/heic"
            ]

            if (!MIME_TYPES.includes(result.mime)) {
                throw new BadRequestException(
                    "The image should be either jpeg, png, or webp."
                )
            }
            return value
        }else {
            throw new BadRequestException(
                "File type could not be detected"
            )
        }



    }
}
