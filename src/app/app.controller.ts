import {Body, Controller, Get, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {ImageUrlDto} from "../shared/dto/imageUrl-dto";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @HttpCode(HttpStatus.OK)
    @Get("seedData")
    async seedData() {
        return await this.appService.seedData();
    }

    @HttpCode(HttpStatus.OK)
    @Post("getImageBase64")
    getImageBase64(@Body() payload: ImageUrlDto){
        return this.appService.getImageUrlBase64(payload);
    }

}
