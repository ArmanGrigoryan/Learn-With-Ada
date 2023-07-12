import { Router } from 'express';
import UserController from '../controller/userController';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import validator from '../core/middleware/validator';
import { RoleTypes } from '../utils/constant';

const route = Router();
const userController = new UserController();

route.post('/signin', userController.signIn);
route.post('/signup', validator('user-create'), userController.signUp);
route.get(
    '/',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    userController.getUsers,
);
route.get(
    '/result/:userId/:courseId',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    userController.getPassedLessons,
);
route.put('/register/:id', userController.addUserPassword);
route.put(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN]),
    userController.editUserRole,
);

export default route;
