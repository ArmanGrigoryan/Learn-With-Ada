import NotificationService from '../services/notificationService';
import Notification from '../db/models/notification';
import { ApiResponse } from '../core/models/responseModel';
import type { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';

const notification = new NotificationService();
export default class NotificationController {
    public async getAll(
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const notifications = await notification.getAll(next);
            if (!notifications) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'Notifications',
                        ),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        notifications,
                        'Notifications data',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }
    public async getUserNotifications(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { limit, skip, isNew } = req.query;
            const { userId } = res.locals.user;
            const notificationData =
                await notification.getNotificationsByUserId(
                    userId,
                    Number(limit) || 10,
                    Number(skip) || 0,
                    Boolean(isNew),
                    next,
                );
            if (!notificationData) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'Notifications',
                        ),
                    );
            }
            const { userNotifications, count } = notificationData as {
                userNotifications: Notification[];
                count: number;
            };

            if (!userNotifications) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'Notifications',
                        ),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        { userNotifications, count },
                        'Notifications data',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }
    public async create(
        req: Request & { io: Server },
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { businessAdminId, userId, courseId } = req.body;
            if (!businessAdminId || !userId || !courseId) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const newNotification = await notification.addNewNotification(
                req.body,
                next,
            );
            req.io.emit('getNotification', newNotification);
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        newNotification,
                        'Notification was send successfully',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }
    public async updateNotification(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const updatedNotification = await notification.updateNotification(
                req.body.ids,
                next,
            );
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        updatedNotification,
                        'Notification was updated successfully',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }
}
