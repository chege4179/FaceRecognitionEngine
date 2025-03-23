import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";


@Injectable()
export class AppService {
    constructor() {

    }

    getHello(): string {
        return 'Face Recognition Engine running......';
    }
}
