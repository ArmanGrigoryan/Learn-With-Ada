import User from '../db/models/user';
import AssessmentResult from '../db/models/assessmentResult';
import { NextFunction, Request } from 'express';
import { MemberStatus, RoleTypes } from '../utils/constant';
import Course from '../db/models/course';
import Business from '../db/models/business';
import { BusinessMember } from '../db/models/businessMember';
import JwtService from './jwtService';
import Topic from '../db/models/topic';

const jwtService = new JwtService();
export default class UserService {
    public async addUserPassword(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        next: NextFunction,
    ): Promise<{
        newUser: User;
        token: string;
    } | void> {
        try {
            const businesses = await BusinessMember.findAll({
                where: {
                    userId: id,
                },
            });

            await User.destroy({
                where: {
                    id,
                },
            });
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password,
                role: RoleTypes.USER,
            });
            await BusinessMember.destroy({
                where: {
                    userId: id,
                },
            });
            for (const business of businesses) {
                await BusinessMember.create({
                    status: MemberStatus.ACTIVE,
                    businessId: business['businessId'],
                    token: null,
                    userId: newUser['id'],
                });
            }
            const token = jwtService.generateAccessToken(
                newUser['id'],
                newUser['email'],
                newUser['role'],
            );
            return {
                newUser,
                token,
            };
        } catch (err) {
            return next(err);
        }
    }

    public async getAll(next: NextFunction): Promise<User[] | void> {
        try {
            return User.findAll({
                include: Course,
            });
        } catch (e) {
            return next(e);
        }
    }

    public async getUserById(
        req: Request,
        id: number,
        next: NextFunction,
    ): Promise<User | void> {
        try {
            return User.findByPk(id, {
                include: [
                    {
                        all: true,
                        nested: true,
                    },
                ],
            });
        } catch (e) {
            return next(e);
        }
    }

    public async updateUserById(
        id: number,
        role: RoleTypes,
        next: NextFunction,
    ): Promise<[number] | void> {
        try {
            return User.update(
                {
                    role,
                },
                {
                    where: {
                        id,
                    },
                },
            );
        } catch (e) {
            return next(e);
        }
    }

    public async getUserByEmail(
        email: string,
        next: NextFunction,
    ): Promise<User | void> {
        try {
            const user = await User.findOne({
                where: {
                    email: email,
                },
            });
            if (!user) {
                return user;
            } else {
                return User.findOne({
                    where: {
                        email: email,
                    },
                    include: [
                        {
                            model: Business,
                        },
                    ],
                });
            }
        } catch (e) {
            return next(e);
        }
    }

    public async addNewUser(
        body: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: string;
        },
        next: NextFunction,
    ): Promise<User | void> {
        try {
            return User.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: body.password,
                role: body.role,
            });
        } catch (e) {
            return next(e);
        }
    }

    public async getPassedLessons(
        userId: number,
        courseId: number,
        next: NextFunction,
    ): Promise<{ passed: number; total: number; courseId: number } | void> {
        try {
            const course = await Course.findByPk(courseId, {
                include: [
                    {
                        model: Topic,
                    },
                ],
            });
            const courseLessons = course['Topics']?.length
                ? course['Topics']['Lesons']
                : [];
            const lessonIds = courseLessons.map(({ id }) => id);
            let passedLessons = [];
            for (const lessonId of lessonIds) {
                passedLessons.push(
                    await AssessmentResult.findAll({
                        where: {
                            userId,
                            lessonId,
                        },
                    }),
                );
            }
            passedLessons = passedLessons.reduce((acc, item) => {
                !acc.includes(item.lessonId.toString()) && item.score !== 0
                    ? acc.push(item.lessonId.toString())
                    : null;
                return acc;
            }, []);
            return {
                passed: passedLessons.length,
                total: courseLessons.length,
                courseId: courseId,
            };
        } catch (e) {
            return next(e);
        }
    }
}
