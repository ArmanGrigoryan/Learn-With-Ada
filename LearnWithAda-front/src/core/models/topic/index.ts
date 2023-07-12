import { LessonGet } from '../lesson';
export enum TopicDataKeys {
    ID = 'id',
    COURSE_ID = 'courseId',
    NAME = 'name',
    LESSONS = 'lessons',
    CREATED_BY_USER_ID = 'createdByUserId',
    LOADING = 'loading',
}
export interface TopicData {
    [TopicDataKeys.ID]: string;
    [TopicDataKeys.COURSE_ID]: string;
    [TopicDataKeys.NAME]: string;
    [TopicDataKeys.CREATED_BY_USER_ID]?: string;
    [TopicDataKeys.LESSONS]: LessonGet[];
    [TopicDataKeys.LOADING]?: boolean;
}
export interface LoadTopics {
    [prop: string]: boolean;
}
export const enum TopicDuplicationError {
    DUPLICATION_ERROR = 'duplication-error',
}
