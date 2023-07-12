import Group from '../db/models/group';
import { NextFunction } from 'express';
import UserService from './userService';
import { GroupProgressData } from '../core/models/groupProgressModel';
import { CourseStatus } from '../utils/constant';
import { GroupCourse } from '../db/models/groupCourse';
import { GroupUser } from '../db/models/groupUser';
import User from '../db/models/user';
import Course from '../db/models/course';
import Business from '../db/models/business';

const userService = new UserService();
export default class GroupService {
    public async getGroupProgress(
        id: number,
        next: NextFunction,
    ): Promise<GroupProgressData[] | void> {
        try {
            const res: GroupProgressData[] = [];
            const group = await Group.findByPk(id, {
                include: [
                    {
                        model: User,
                    },
                    {
                        model: Course,
                    },
                ],
            });
            for (const user of group['Users']) {
                for (const course of group['Courses']) {
                    const passedLessons = await userService.getPassedLessons(
                        user['id'],
                        course['id'],
                        next,
                    );
                    if (passedLessons) {
                        if (passedLessons.passed == 0) {
                            res.push(
                                new GroupProgressData(
                                    user.id,
                                    course.id,
                                    CourseStatus.NOT_STARTED,
                                ),
                            );
                        } else if (
                            passedLessons.passed == passedLessons.total
                        ) {
                            res.push(
                                new GroupProgressData(
                                    user.id,
                                    course.id,
                                    CourseStatus.PENDING,
                                ),
                            );
                        } else {
                            res.push(
                                new GroupProgressData(
                                    user.id,
                                    course.id,
                                    CourseStatus.COMPLETED,
                                ),
                            );
                        }
                    }
                }
            }
            let arr = [];
            if (res) {
                for (const elem of res) {
                    const num = res.filter(
                        (item) =>
                            item.progress == elem.progress &&
                            item.courseId == elem.courseId,
                    ).length;
                    if (
                        !arr.includes({
                            courseId: elem.courseId,
                            progress: elem.progress,
                            userCount: num,
                        })
                    ) {
                        arr.push({
                            courseId: elem.courseId,
                            progress: elem.progress,
                            userCount: num,
                        });
                    }
                }
                arr = arr.reduce((acc, elem) => {
                    !acc.find(
                        (item) =>
                            item.courseId === elem.courseId &&
                            item.progress === elem.progress,
                    ) && acc.push(elem);
                    return acc;
                }, []);
            }
            return arr;
        } catch (err) {
            return next(err);
        }
    }
    public async updateGroup(
        id: number,
        name: string,
        userId: number,
        courseId: number,
        action: 'add' | 'remove' | 'rename',
        next: NextFunction,
    ): Promise<Group | void> {
        try {
            switch (action) {
                case 'add':
                    if (userId) {
                        await GroupUser.create({
                            userId: userId,
                            groupId: id,
                        });
                    }
                    if (courseId) {
                        await GroupCourse.create({
                            courseId: courseId,
                            groupId: id,
                        });
                    }
                    break;
                case 'remove':
                    if (courseId) {
                        await GroupCourse.destroy({
                            where: {
                                groupId: id,
                                courseId: courseId,
                            },
                        });
                    }
                    if (userId) {
                        await GroupUser.destroy({
                            where: {
                                groupId: id,
                                userId: userId,
                            },
                        });
                    }
                    break;
                case 'rename':
                    await Group.update(
                        {
                            name: name,
                        },
                        {
                            where: {
                                id: id,
                            },
                        },
                    );
                    break;
            }
            return Group.findByPk(id, {
                include: [Course, User],
            });
        } catch (err) {
            return next(err);
        }
    }
    public async createGroup(
        name: string,
        creator: number,
        businessId: number,
        userIds: number[],
        courseIds: number[],
        next: NextFunction,
    ): Promise<Group | void> {
        try {
            const group = await Group.create({
                name: name,
                creator: creator,
                businessId: businessId,
            });
            for (const id of userIds) {
                await GroupUser.create({
                    userId: id,
                    groupId: group['id'],
                });
            }
            for (const id of courseIds) {
                await GroupCourse.create({
                    courseId: id,
                    groupId: group['id'],
                });
            }
            return await Group.findByPk(group['id'], {
                include: [
                    {
                        model: Business,
                    },
                    {
                        model: User,
                    },
                ],
            });
        } catch (err) {
            return next(err);
        }
    }
    public async getAll(next: NextFunction): Promise<Array<Group> | void> {
        try {
            return Group.findAll({
                include: [Course, User],
            });
        } catch (err) {
            return next(err);
        }
    }
    public async getGroupById(
        id: number,
        next: NextFunction,
    ): Promise<Group | void> {
        try {
            return Group.findByPk(id, {
                include: [Course, User],
            });
        } catch (err) {
            return next(err);
        }
    }
    public async deleteGroupById(
        id: number,
        next: NextFunction,
    ): Promise<Group | void> {
        try {
            const deletedGroup = await Group.findByPk(id);
            await GroupCourse.destroy({
                where: {
                    groupId: id,
                },
            });
            await GroupUser.destroy({
                where: {
                    groupId: id,
                },
            });
            await Group.destroy({
                where: { id },
            });
            return deletedGroup;
        } catch (err) {
            return next(err);
        }
    }
}
