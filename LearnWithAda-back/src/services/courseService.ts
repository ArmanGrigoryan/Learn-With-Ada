import Course, { CourseData } from '../db/models/course';
import { NextFunction, Request } from 'express';
import { CourseVisibility, RoleTypes } from '../utils/constant';
import { IToken } from '../core/models/tokenModel';
import CourseUser from '../db/models/coursesUsers';
import { Op } from 'sequelize';
import CourseTopic from '../db/models/courseTopic';

export default class CourseService {
    public async getCourseById(
        id: number,
        next: NextFunction,
    ): Promise<Course | void> {
        try {
            const course = await Course.findByPk(id);
            let users = (await CourseUser.findAll({
                where: {
                    courseId: id,
                },
            })) as unknown[];
            users = users.map((item) => (item = item['userId']));
            course.setDataValue('userIds', users);

            let topics = (await CourseTopic.findAll({
                where: {
                    courseId: id,
                },
            })) as unknown[];
            topics = topics.map((item) => (item = item['topicId']));
            course.setDataValue('topicIds', topics);
            return course;
        } catch (e) {
            return next(e);
        }
    }
    public async deleteCourseById(
        id: number,
        next: NextFunction,
    ): Promise<Course | void> {
        try {
            const deletedCourse = await Course.findByPk(id);
            await CourseUser.destroy({
                where: {
                    courseId: id,
                },
            });

            await CourseTopic.destroy({
                where: {
                    courseId: id,
                },
            });
            await Course.destroy({
                where: {
                    id,
                },
            });
            return deletedCourse;
        } catch (e) {
            return next(e);
        }
    }
    public async getAll(
        req: Request,
        user: IToken,
        next: NextFunction,
    ): Promise<Course[] | void> {
        try {
            const search = req.query?.search;
            const users = await CourseUser.findAll();
            const topics = await CourseTopic.findAll();
            if (user.role === RoleTypes.BUSINESS_ADMIN) {
                if (search) {
                    const privateCourses = await Course.findAll({
                        where: {
                            createdByUserId: user.userId,
                            name: {
                                [Op.substring]: search,
                            },
                            visibility: CourseVisibility.PRIVATE,
                        },
                    });

                    const publicCourses = await Course.findAll({
                        where: {
                            name: {
                                [Op.substring]: search,
                            },
                            visibility: CourseVisibility.PUBLIC,
                        },
                    });
                    const courses = publicCourses.concat(privateCourses);
                    const length =
                        topics.length > users.length
                            ? topics.length
                            : users.length;
                    for (const course of courses) {
                        course.setDataValue('topicIds', []);
                        course.setDataValue('userIds', []);
                        for (let i = 0; i < length; i++) {
                            if (topics?.[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['topicIds'].push(
                                    topics?.[i]?.['topicId'],
                                );
                            }
                            if (users?.[i]?.['courseId'] === course['id']) {
                                course?.['dataValues']?.['userIds'].push(
                                    users[i]['userId'],
                                );
                            }
                        }
                    }
                    return courses;
                } else {
                    const privateCourses = await Course.findAll({
                        where: {
                            createdByUserId: user.userId,
                            visibility: CourseVisibility.PRIVATE,
                        },
                    });

                    const publicCourses = await Course.findAll({
                        where: {
                            visibility: CourseVisibility.PUBLIC,
                        },
                    });
                    const courses = publicCourses.concat(privateCourses);
                    const length =
                        topics.length > users.length
                            ? topics.length
                            : users.length;
                    for (const course of courses) {
                        course.setDataValue('topicIds', []);
                        course.setDataValue('userIds', []);
                        for (let i = 0; i < length; i++) {
                            if (topics?.[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['topicIds'].push(
                                    topics?.[i]?.['topicId'],
                                );
                            }
                            if (users?.[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['userIds'].push(
                                    users?.[i]?.['userId'],
                                );
                            }
                        }
                    }
                    return courses;
                }
            } else if (user.role === RoleTypes.ADMIN) {
                if (search) {
                    const courses = await Course.findAll({
                        where: {
                            name: {
                                [Op.substring]: search,
                            },
                        },
                    });
                    const length =
                        topics.length > users.length
                            ? topics.length
                            : users.length;
                    for (const course of courses) {
                        course.setDataValue('topicIds', []);
                        course.setDataValue('userIds', []);
                        for (let i = 0; i < length; i++) {
                            if (topics?.[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['topicIds'].push(
                                    topics?.[i]?.['topicId'],
                                );
                            }
                            if (users?.[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['userIds'].push(
                                    users?.[i]?.['userId'],
                                );
                            }
                        }
                    }
                    return courses;
                } else {
                    const courses = await Course.findAll();
                    const length =
                        topics.length > users.length
                            ? topics.length
                            : users.length;
                    for (const course of courses) {
                        course.setDataValue('topicIds', []);
                        course.setDataValue('userIds', []);
                        for (let i = 0; i < length; i++) {
                            if (topics[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['topicIds'].push(
                                    topics?.[i]?.['topicId'],
                                );
                            }
                            if (users[i]?.['courseId'] === course?.['id']) {
                                course?.['dataValues']?.['userIds'].push(
                                    users?.[i]?.['userId'],
                                );
                            }
                        }
                    }
                    return courses;
                }
            } else {
                const courses = await Course.findAll({
                    where: {
                        visibility: CourseVisibility.PUBLIC,
                    },
                });
                const length =
                    topics.length > users.length ? topics.length : users.length;
                for (const course of courses) {
                    course.setDataValue('topicIds', []);
                    course.setDataValue('userIds', []);
                    for (let i = 0; i < length; i++) {
                        if (topics?.[i]?.['courseId'] === course?.['id']) {
                            course?.['dataValues']?.['topicIds'].push(
                                topics?.[i]?.['topicId'],
                            );
                        }
                        if (users?.[i]?.['courseId'] === course?.['id']) {
                            course?.['dataValues']?.['userIds'].push(
                                users?.[i]?.['userId'],
                            );
                        }
                    }
                }
                return courses;
            }
        } catch (e) {
            return next(e);
        }
    }

    public async addNewCourse(
        userId: number,
        courseData: CourseData,
        next: NextFunction,
    ): Promise<Course | void> {
        try {
            const course = await Course.create({
                name: courseData.name,
                price: courseData.price,
                description: courseData.description,
                createdByUserId: userId,
                logo: courseData.logo,
                currentPrice: courseData?.currentPrice
                    ? courseData.currentPrice
                    : null,
                visibility: courseData.visibility,
            });
            course.setDataValue('userIds', []);
            course.setDataValue('topicIds', []);
            return course;
        } catch (e) {
            return next(e);
        }
    }

    public async update(
        id: number,
        courseData: {
            name: string;
            userId: number;
            topicId: number;
            visibility: CourseVisibility;
            price: number;
            currentPrice: number;
            description: string;
            logo: string;
        } & {
            action: string;
        },
        userId: number,
        next: NextFunction,
    ): Promise<Course | void> {
        try {
            await Course.update(
                {
                    name: courseData?.name,
                    visibility: courseData?.visibility,
                    price: courseData?.price,
                    currentPrice: courseData?.currentPrice,
                    description: courseData?.description,
                    logo: courseData?.logo,
                },
                {
                    where: { id },
                },
            );
            if (courseData.topicId) {
                if (courseData.action === 'add') {
                    await CourseTopic.create({
                        courseId: id,
                        topicId: courseData.topicId,
                    });
                } else {
                    await CourseTopic.destroy({
                        where: {
                            courseId: id,
                            topicId: courseData.topicId,
                        },
                    });
                }
            }
            if (courseData.userId) {
                if (courseData.action === 'add') {
                    await CourseUser.create({
                        courseId: id,
                        userId: courseData.userId,
                    });
                } else {
                    await CourseUser.destroy({
                        where: {
                            courseId: id,
                            userId: courseData.userId,
                        },
                    });
                }
            }
            const course = await Course.findByPk(id);
            let users = (await CourseUser.findAll({
                where: {
                    courseId: id,
                },
            })) as unknown[];
            users = users.map((item) => (item = item['userId']));
            course.setDataValue('userIds', users);

            let topics = (await CourseTopic.findAll({
                where: {
                    courseId: id,
                },
            })) as unknown[];
            topics = topics.map((item) => (item = item['topicId']));
            course.setDataValue('topicIds', topics);
            return course;
        } catch (e) {
            return next(e);
        }
    }
}
