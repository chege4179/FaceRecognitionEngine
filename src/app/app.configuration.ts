import {Configuration, Value} from "@itgorillaz/configify";


@Configuration()
export class AppConfiguration {

    @Value("NODE_ENV")
    environment: string;

}