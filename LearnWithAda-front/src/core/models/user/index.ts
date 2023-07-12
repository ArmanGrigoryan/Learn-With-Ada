import { AuthDataKeys, CourseStatus, UserStoreDataKeys } from '../../../utils/constants';
import { CourseData } from '../course';

export interface UserCourse extends CourseData {
    course: string;
    status: CourseStatus;
    passedLessons: number;
    totalLessons: number;
}

export interface UserInterface {
    [UserStoreDataKeys.ID]: string;
    [UserStoreDataKeys.EMAIL]: string;
    [UserStoreDataKeys.FIRST_NAME]: string;
    [UserStoreDataKeys.LAST_NAME]: string;
    [UserStoreDataKeys.COURSES]: UserCourse[];
    [UserStoreDataKeys.ROLE]: string;
    [UserStoreDataKeys.BUSINESSES]: Array<UserInvitedBusiness>;
}

export interface UserInvitedBusiness {
    [UserStoreDataKeys.BUSINESS_ID]: string;
    [UserStoreDataKeys.BUSINESS_NAME]: string;
    [UserStoreDataKeys.INVITER]?: string;
    [UserStoreDataKeys.INVITER_EMAIL]?: string;
    [UserStoreDataKeys.MEMBERS_COUNT]?: number;
}

export interface SignInData {
    [UserStoreDataKeys.EMAIL]: string;
    [UserStoreDataKeys.PASSWORD]: string;
    [UserStoreDataKeys.MESSAGE]?: string;
}

export enum SignInPostErrorCodes {
    INVALID_PASSWORD_OR_EMAIL = 'INVALID_PASSWORD_OR_EMAIL',
}

export enum SignupPostErrorCodes {
    EMAIL_EXISTS = 'EMAIL_EXISTS',
}

export interface SignUpData extends UserInterface {
    [UserStoreDataKeys.PASSWORD]: string;
}

export interface AuthData {
    [AuthDataKeys.USER_ID]: string;
    [AuthDataKeys.ACCESS_TOKEN]: string;
    [AuthDataKeys.FIRSTNAME]?: string;
    [AuthDataKeys.LASTNAME]?: string;
    [AuthDataKeys.ROLE]?: string;
    [AuthDataKeys.EMAIL]?: string;
}

export interface DecodedToken {
    email: string;
    exp: number;
    iat: number;
    role: string;
    userId: string;
}

export interface AnswerChoiceObj {
    lessonId: string;
    answerChoice: string | string[];
}

export interface AssessmentResultData {
    [AuthDataKeys.USER_ID]: string;
    topicId?: string;
    answerChoices: AnswerChoiceObj[];
}
