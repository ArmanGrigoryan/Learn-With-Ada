export const API_URL = process.env.API_URL;
export enum AuthDataKeys {
    USER_ID = 'userId',
    ACCESS_TOKEN = 'accessToken',
    STATUS = 'status',
    ROLE = 'role',
    EMAIL = 'email',
    FIRSTNAME = 'firstName',
    LASTNAME = 'lastName',
}
export enum AuthResult {
    NONE = 'none',
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum FormNames {
    SIGN_UP = 'sign-up-form',
    SIGN_UP_TOKEN = 'sign-up-form-token',
    SIGN_IN = 'sign-in-form',
    FORGOT_PASS = 'forgot-password-form',
    ADD_TOPIC = 'add-topic',
    ADD_COURSE = 'add-course',
    ADD_LESSON = 'add-topic',
    TAKE_ASSESSMENT = 'take-assessment',
    CREATE_GROUP = 'create-group',
    BUSINESS_INVITE = 'business-invite',
}

export enum UserStoreDataKeys {
    ID = 'id',
    EMAIL = 'email',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    PASSWORD = 'password',
    COURSES = 'courses',
    ROLE = 'role',
    INVITED = 'invited',
    BUSINESSES = 'businesses',
    BUSINESS_ID = 'id',
    BUSINESS_NAME = 'name',
    TOKEN = 'token',
    MEMBERS = 'members',
    MEMBERS_COUNT = 'membersCount',
    MESSAGE = 'message',
    INVITER = 'inviter',
    INVITER_EMAIL = 'inviterEmail',
}

export enum AssessmentAnswerTypes {
    SIMPLE = 'simple',
    MULTI_CHOICE = 'multi-correct',
    SINGLE_CHOICE = 'single-correct',
}

export enum ResponseErrorMessages {
    UNAUTHORIZED_MESSAGE = '',
}

export const enum CourseStatus {
    COMPLETED = 'completed',
    IN_PROGRESS = 'in progress',
    NOT_STARTED = 'not started',
}

export const enum RoleTypes {
    ADMIN = 'admin',
    BUSINESS_ADMIN = 'business-admin',
    USER = 'user',
}

export enum BusinessMemberStatus {
    INVITED = 'invited',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}
