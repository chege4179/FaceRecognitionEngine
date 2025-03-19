import {BadRequestException, Injectable, Logger, PipeTransform} from "@nestjs/common";
import {loadEsm} from 'load-esm';
import heicConvert from "heic-convert"
import {ErrorMapping} from "../config/ErrorMapping";

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    async transform(value: Express.Multer.File) {

        const {fileTypeFromBuffer} = await loadEsm<typeof import('file-type')>('file-type')

        const result = await fileTypeFromBuffer(value.buffer)

        Logger.log(`MIME received ${result.mime}`, "FileTypeValidationPipe")
        if (result.mime === "image/heic") {
            const outputBuffer = await heicConvert({
                buffer: value.buffer,
                format: 'JPEG',
                quality: 1
            });
            return {
                ...value,
                buffer: outputBuffer,
            }
        }
        if (result) {
            const MIME_TYPES = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ]

            if (!MIME_TYPES.includes(result.mime)) {
                throw new BadRequestException(ErrorMapping.INVALID_MIME_TYPE.message, {
                    cause: new Error(),
                    description: ErrorMapping.INVALID_MIME_TYPE.code,
                });
            }
            return value
        } else {
            throw new BadRequestException(ErrorMapping.MIME_TYPE_CHECK_FAILED.message, {
                cause: new Error(),
                description: ErrorMapping.MIME_TYPE_CHECK_FAILED.code,
            });
        }


    }
}
