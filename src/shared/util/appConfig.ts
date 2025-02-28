




export const AppConfig = {
    JWT_SECRET:"peter",
    OTP_EXPIRY_TIME: 2 * 60
}

export const LoggerTags = {

    DATABASE_CONNECTION:"DatabaseConnection",
    BOOT_STRAPPING:"Bootstrapping",
    JWT_VALIDATION_ERROR:"JWTValidationError",

    LIKE_FIREBASE_CLOUD_MESSAGING:"LikeFirebaseCloudMessaging",
    COMMENT_FIREBASE_CLOUD_MESSAGING:"CommentFirebaseCloudMessaging",
    FOLLOW_FIREBASE_CLOUD_MESSAGING:"FollowFirebaseCloudMessaging",
    PROMOTIONAL_MESSAGE:"PromotionalMessaging",

    PRISMA_MIDDLE_WARE:"PrismaMiddleware",
    EXCEPTION_FILTER:"ExceptionFilter",
    CRON_JOB:"CRON_JOB",
    WEBSOCKET:"Websocket",
}