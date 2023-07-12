import { Router } from 'express';
import BusinessController from '../controller/businessController';
import { RoleTypes } from '../utils/constant';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import validator from '../core/middleware/validator';

const route = Router();
const businessController = new BusinessController();

route.post(
    '/',
    validator('business-create'),
    verifyUser,
    businessController.createBusiness,
);
route.get(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    businessController.getBusinessById,
);
route.delete(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    businessController.deleteBusiness,
);
route.get('/', verifyUser, businessController.getAll);
route.get(
    '/user/:userId',
    verifyUser,
    businessController.getUserBusinessesById,
);
route.put(
    '/invite',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    businessController.inviteUser,
);
route.put(
    '/change-status',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    businessController.changeUserStatus,
);
route.put(
    '/',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    businessController.updateName,
);

export default route;
