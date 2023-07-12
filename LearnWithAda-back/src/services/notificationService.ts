import Notification from '../db/models/notification';
import { NextFunction } from 'express';

export default class NotificationService {
    public async getAll(next: NextFunction): Promise<Notification[] | void> {
        try {
            return Notification.findAll();
        } catch (e) {
            return next(e);
        }
    }
    public async getNotificationsByUserId(
        id: number,
        limit: number,
        skip: number,
        isNew: boolean,
        next: NextFunction,
    ): Promise<{
        userNotifications: Notification[];
        count: number;
    } | void> {
        try {
            const userNotifications = await Notification.findAll({
                where: {
                    seen: isNew,
                },
                order: [['createdAt', 'DESC']],
                limit: limit * (skip + 1),
                offset: 0,
            });
            const count: number = await Notification.findAndCountAll({
                where: {
                    userId: id,
                    seen: isNew,
                },
            })['count'];
            return { userNotifications, count };
        } catch (e) {
            return next(e);
        }
    }
    public async addNewNotification(
        { businessAdminId, courseId, userId }: Notification,
        next: NextFunction,
    ): Promise<Notification | void> {
        try {
            return Notification.create({
                businessAdminId,
                userId,
                courseId,
            });
        } catch (e) {
            return next(e);
        }
    }
    public async updateNotification(
        ids: string[],
        next: NextFunction,
    ): Promise<[number] | void> {
        try {
            return Notification.update(
                {
                    seen: true,
                },
                {
                    where: {
                        ...ids,
                    },
                },
            );
        } catch (e) {
            return next(e);
        }
    }
}
