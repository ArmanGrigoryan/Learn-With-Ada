import { Router } from 'express';
import NotificationController from '../controller/notificationController';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import validator from '../core/middleware/validator';
import { RoleTypes } from '../utils/constant';

const route = Router();
const notificationController = new NotificationController();
route.get(
    '/',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    notificationController.getAll,
);
route.post(
    '/',
    validator('notification-create'),
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    notificationController.create,
);
route.put(
    '/',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER]),
    notificationController.updateNotification,
);
route.get('/own', verifyUser, notificationController.getUserNotifications);

export default route;
