import { Router } from 'express';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import GroupController from '../controller/groupController';
import { RoleTypes } from '../utils/constant';
import validator from '../core/middleware/validator';

const route = Router();
const groupController = new GroupController();
route.post(
    '/',
    validator('group-create'),
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    groupController.createGroup,
);
route.get('/', verifyUser, groupController.getAllGroups);
route.get('/:id', verifyUser, groupController.getGroup);
route.get(
    '/progress/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    groupController.getGroupProgress,
);
route.put(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    groupController.updateGroup,
);
route.delete(
    '/',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    groupController.deleteGroup,
);
export default route;
