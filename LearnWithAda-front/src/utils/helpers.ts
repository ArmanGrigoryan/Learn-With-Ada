import { UrlParams } from './interfaces';
import { BusinessData } from '../core/models/business';
import { GroupData } from '../core/models/group';
import { TopicData } from '../core/models/topic';
import { LessonGet } from '../core/models/lesson';
import { AssessmentAnswerTypes } from './constants';
import { CourseData } from '../core/models/course';
import { authorizedPages } from '../routes/routes';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const getTopicName = (id: string, topics: TopicData[]) => {
    return topics.find(topic => topic.id === id)?.name || '';
};

export const getBusinessName = (id: string, businesses: BusinessData[]) => {
    return businesses.find(business => business.id === id)?.name || '';
};

export const getTopicLessons = (id: string, lessons: LessonGet[]) => {
    let topicLessons: LessonGet[] = [];
    topicLessons = lessons?.filter((lesson: LessonGet) => {
        return lesson.topicId === id;
    });
    return topicLessons;
};

export const getLessonAnswerType = (lesson: LessonGet) => {
    if (lesson) {
        const isMulti: boolean[] = [];
        let isSimple = true;
        lesson?.assessment?.[0]?.answerChoices?.length > 0 &&
            lesson?.assessment?.[0]?.answerChoices.forEach(
                ({ answerChoice, isCorrect }: { answerChoice: string; isCorrect: boolean }) => {
                    isMulti.push(isCorrect);
                    if (typeof answerChoice !== 'boolean') {
                        isSimple = false;
                    }
                },
            );

        const type = isMulti
            .filter((item, index) => isMulti.indexOf(item) !== index)
            .includes(true);
        if (isSimple) {
            return {
                assessmentAnswerType: AssessmentAnswerTypes.SIMPLE,
            };
        }
        if (type) {
            return {
                assessmentAnswerType: AssessmentAnswerTypes.MULTI_CHOICE,
            };
        }

        if (!type) {
            return {
                assessmentAnswerType: AssessmentAnswerTypes.SINGLE_CHOICE,
            };
        }
    }
};

export const isUserInvited = (id = '', course = {} as CourseData) => {
    return Array.isArray(course?.userIds) ? course?.userIds?.includes(id) : false;
};

export const isTopicAdded = (id = '', course = {} as CourseData) => {
    return Array.isArray(course?.topicIds) ? course?.topicIds?.includes(id) : false;
};

export const isGroupCourseAdded = (id = '', group = {} as GroupData) => {
    return group.courseIds?.includes(id);
};

export const isGroupUserAdded = (id = '', group = {} as GroupData) => {
    return group.userIds?.includes(id);
};

export const isPermitted = (key: string, role: string): boolean => {
    let permission = false;
    authorizedPages.forEach(({ roles, key: routeKey }: { roles: string[]; key: string }) => {
        if (routeKey === key && roles.includes(role)) {
            permission = true;
        }
    });
    return permission;
};

export const getUrlParams = (url: string): UrlParams => {
    const paramsArr = url.replace('?', '').split('&');
    return paramsArr.reduce((res, each) => {
        const [key, value] = each.split('=');
        res[key as string] = value;
        return res;
    }, {} as UrlParams);
};
