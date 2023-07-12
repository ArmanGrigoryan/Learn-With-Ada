export enum Visibility {
    public = 'public',
    private = 'private',
}

export enum CourseDataKeys {
    ID = 'id',
    NAME = 'name',
    TOPIC_IDS = 'topicIds',
    USER_IDS = 'userIds',
    TOTALLESSONS = 'totalLessons',
    CREATEDBYUSERID = 'createdByUserId',
    PRICE = 'price',
    CURRENTPRICE = 'currentPrice',
    DESCRIPTION = 'description',
    LOGO = 'logo',
    FILE = 'file',
    VISIBILITY = 'visibility',
}

export interface CourseData {
    [CourseDataKeys.ID]?: string;
    [CourseDataKeys.NAME]?: string;
    [CourseDataKeys.TOPIC_IDS]?: string[] | string;
    [CourseDataKeys.USER_IDS]?: string[] | string;
    [CourseDataKeys.TOTALLESSONS]?: number;
    [CourseDataKeys.CREATEDBYUSERID]?: string;
    [CourseDataKeys.PRICE]?: number;
    [CourseDataKeys.CURRENTPRICE]?: number;
    [CourseDataKeys.DESCRIPTION]?: string;
    [CourseDataKeys.LOGO]?: string;
    [CourseDataKeys.FILE]?: string | File;
    [CourseDataKeys.VISIBILITY]?: Visibility;
}
