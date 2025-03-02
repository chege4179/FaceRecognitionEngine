import {Module} from "@nestjs/common";
import {SharedModule} from "../../shared/shared/shared.module";
import {FaceController} from "./face.controller";
import {FaceService} from "./face.service";


@Module({
    imports: [SharedModule],
    controllers: [FaceController],
    providers: [FaceService],
})
export class FaceModule {

}