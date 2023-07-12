import { Router } from 'express';
import CourseController from '../controller/courseController';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import { upload } from '../core/middleware/upload';
import validator from '../core/middleware/validator';
import { RoleTypes } from '../utils/constant';

const route = Router();
const courseController = new CourseController();

route.get('/', verifyUser, courseController.getAll);
route.post(
    '/',
    upload.array('myFiles', 1),
    validator('course-create'),
    verifyUser,
    permission([RoleTypes.BUSINESS_ADMIN, RoleTypes.ADMIN]),
    courseController.create,
);
route.put(
    '/:id',
    verifyUser,
    upload.array('myFiles', 1),
    permission([RoleTypes.BUSINESS_ADMIN, RoleTypes.ADMIN]),
    courseController.update,
);
route.delete(
    '/:id',
    verifyUser,
    permission([RoleTypes.BUSINESS_ADMIN, RoleTypes.ADMIN]),
    courseController.delete,
);

export default route;
