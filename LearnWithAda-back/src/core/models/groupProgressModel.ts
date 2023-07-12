import { CourseStatus } from '../../utils/constant';

export interface GroupProgressModel {
    userId: string;
    courseId: string;
    progress: CourseStatus;
}

export class GroupProgressData implements GroupProgressModel {
    constructor(
        public userId: string = '',
        public courseId: string = '',
        public progress: CourseStatus = CourseStatus.NOT_STARTED,
    ) {}
}
