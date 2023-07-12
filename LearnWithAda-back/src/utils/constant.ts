export const timeForOneInstruction = 30 * 60 * 60;
export const enum CourseStatus {
    COMPLETED = 'completed',
    PENDING = 'in progress',
    NOT_STARTED = 'not started',
}

export const enum CourseVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export const enum RoleTypes {
    ADMIN = 'admin',
    BUSINESS_ADMIN = 'business-admin',
    USER = 'user',
}

export const enum MemberStatus {
    INVITED = 'invited',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export const enum InvitedAction {
    SIGNUP = 'signup',
    SIGNIN = 'signin',
    ACTIVE = 'active',
}

export const uploadedFileSizeLimit = 200; //in mb

export const allowedFileExtensions = [
    /png/,
    /jpg/,
    /jpeg/,
    /pdf/,
    /mp4/,
    /txt/,
];
