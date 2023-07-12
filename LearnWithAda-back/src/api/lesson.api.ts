import { Router } from 'express';
import LessonController from '../controller/lessonController';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import validator from '../core/middleware/validator';
import { RoleTypes } from '../utils/constant';
import { upload } from '../core/middleware/upload';

const route = Router();
const lessonController = new LessonController();

route.get('/:id', verifyUser, lessonController.getLesson);
route.get('/', verifyUser, lessonController.getAll);
route.post(
    '/',
    upload.array('file', 1),
    validator('lesson-create'),
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    lessonController.create,
);
route.put(
    '/:id',
    upload.array('file', 1),
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    lessonController.update,
);
route.delete(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    lessonController.deleteLesson,
);

export default route;
