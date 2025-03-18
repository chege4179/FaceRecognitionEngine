export const ErrorMapping = {
    FACE_DETECTION_FAILED: {
        message:
            'Face detection or validation failed, kindly ensure you capture your face clearly and remove any obstruction',
        code: 'FACE_DETECTION_FAILED',
    },
    MULTIPLE_FACES_DETECTED: {
        message:
            'Face verification failed, Please ensure only your face is visible and try again',
        code: 'MULTIPLE_FACES_DETECTED',
    },
    NO_FACE_DETECTED: {
        message:
            'No face was detected, kindly ensure you remain calm, capture your face clearly, remove any obstruction and move to brightly lighted area',
        code: 'NO_FACE_DETECTED',
    },
    SEARCH_FACES_FAILED: {
        message:
            'We were unable to detect if your face exists in our databases',
        code: 'SEARCH_FACES_FAILED',
    },
    FACE_EXISTS: {
        message:
            'Your face already exists in our database',
        code: 'FACE_EXISTS',
    },
    FACE_NOT_FOUND: {
        message: 'This face may have already been deleted or does not exist',
        code: 'FACE_NOT_FOUND',
    },
    DELETE_FACE_FAILED: {
        message: 'We were unable to delete this face at the moment. Please try again later',
        code: 'DELETE_FACE_FAILED',
    },
    FACE_NOT_CAPTURED: {
        message: 'We were unable to capture your face at this time. Please try again later',
        code: 'FACE_NOT_CAPTURED',
    },
    CDN_ERROR: {
        message: 'We were unable to capture your face at this time. Please try again later',
        code: 'CDN_ERROR',
    },
    FACE_ID_NOT_FOUND: {
        message: 'An  unexpected error occurred. Please try again later',
        code: 'FACE_ID_NOT_FOUND',
    },
    ID_ALREADY_EXISTS: {
        message: 'A user with ID already exists. Please try again later',
        code: 'ID_ALREADY_EXISTS',
    },
    DB_CHECK_FAILED: {
        message: 'Failed to validate existing user. Please try again later',
        code: 'DB_CHECK_FAILED',
    },
    FACE_SEARCH_NOT_FOUND: {
        message: 'We could not find the user associated with this image. Please try again later',
        code: 'FACE_SEARCH_NOT_FOUND',
    },
    FACE_DETAILS_NOT_FOUND: {
        message: 'We find your details at this time. Please try again later',
        code: 'FACE_DETAILS_NOT_FOUND',
    }

}