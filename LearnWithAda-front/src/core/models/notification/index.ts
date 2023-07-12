export enum NotificationDataKeys {
    ID = 'id',
    BUSINESSADMINID = 'businessAdminId',
    USERID = 'userId',
    COURSEID = 'courseId',
    TEXT = 'text',
    SEEN = 'seen',
    DATE = 'date',
}
export interface NotificationData {
    [NotificationDataKeys.ID]: string;
    [NotificationDataKeys.BUSINESSADMINID]: string;
    [NotificationDataKeys.USERID]?: string;
    [NotificationDataKeys.COURSEID]?: string;
    [NotificationDataKeys.TEXT]?: string;
    [NotificationDataKeys.SEEN]?: boolean;
    [NotificationDataKeys.DATE]?: string;
}
