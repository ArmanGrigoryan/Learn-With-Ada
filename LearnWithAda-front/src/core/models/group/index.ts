export enum GroupDataKeys {
    NAME = 'name',
    ID = 'id',
    USER_IDS = 'userIds',
    COURSE_IDS = 'courseIds',
    CREATOR = 'creator',
    BUSINESS_ID = 'businessId',
}

export interface GroupData {
    [GroupDataKeys.NAME]: string;
    [GroupDataKeys.ID]: string;
    [GroupDataKeys.USER_IDS]: Array<string>;
    [GroupDataKeys.COURSE_IDS]: Array<string>;
    [GroupDataKeys.CREATOR]: string;
    [GroupDataKeys.BUSINESS_ID]: string;
}
