import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {FaceService} from "./face.service";
import {CaptureFaceDetailsDto} from "../../shared/dto/capture-face-details-dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {FileTypeValidationPipe} from "src/shared/pipes/fileTypeValidator.pipe";
import {DeleteFaceDto} from "../../shared/dto/delete-face-dto";

@Controller("face")
export class FaceController {
    constructor(private readonly faceService: FaceService) {
    }

    @HttpCode(HttpStatus.OK)
    @Get("all")
    async getAllSavedFaces() {
        return await this.faceService.getAllSavedFaces();
    }

    @UseInterceptors(FileInterceptor('photo'))
    @HttpCode(HttpStatus.CREATED)
    @Post("captureDetails")
    async captureDetails(
        @Body() payload: CaptureFaceDetailsDto,
        @UploadedFile(
            new FileTypeValidationPipe(),
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 1000000
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) file: Express.Multer.File,
    ) {
        return this.faceService.captureFaceDetails(payload, file)

    }

    @UseInterceptors(FileInterceptor('photo'))
    @HttpCode(HttpStatus.OK)
    @Post("queryFace")
    async queryFaceMatchs(
        @UploadedFile(
            new FileTypeValidationPipe(),
            new ParseFilePipeBuilder()
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) file: Express.Multer.File,
    ) {
        return await this.faceService.queryFaceMatches(file);
    }

    @HttpCode(HttpStatus.OK)
    @Post("deleteFace")
    async deleteFace(
        @Body() payload: DeleteFaceDto
    ) {
        return await this.faceService.deleteFaces(payload);
    }


}