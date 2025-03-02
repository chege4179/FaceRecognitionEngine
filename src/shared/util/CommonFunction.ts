import {BadRequestException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import {SuccessResponse} from "../config/successResponse";

@Injectable()
export class CommonFunction {


    errorResponse(errorDescription: string, errorCode: string | null = null) {
        if (errorCode) {
            throw new BadRequestException(errorDescription, errorCode);
        } else {
            throw new BadRequestException(errorDescription);
        }

    }

    stringToFloat32Array(str: string) {
        // Remove the opening and closing brackets
        const cleanedStr = str.trim().replace(/^\[|\]$/g, '');

        // Split the string into an array of number strings
        const numStrs = cleanedStr.split(',');

        // Parse each number string as a float and store them in a Float32Array
        const float32Array = new Float32Array(numStrs.length);
        for (let i = 0; i < numStrs.length; i++) {
            float32Array[i] = parseFloat(numStrs[i].trim());
        }

        return float32Array;
    }

    stringToNumberArray(str:string) {
        // Remove the leading and trailing square brackets
        const trimmedStr = str.trim().replace(/^\[|\]$/g, '');

        // Split the string by commas
        const strArray = trimmedStr.split(',');

        // Convert each string element to a number
        const numberArray = strArray.map(Number);

        return numberArray;
    }


    unauthorizedExceptionResponse(message: string, code: string): any {
        throw new UnauthorizedException(message, {
            cause: new Error(),
            description: code,
        });
    }

    successResponse(message: string) {
        return new SuccessResponse(HttpStatus.OK, message);
    }

    successCreatedResponse(message: string) {
        return new SuccessResponse(HttpStatus.CREATED, message)
    }
}