import { Router } from 'express';
import TopicController from '../controller/topicController';
import { verifyUser } from '../core/middleware/auth';
import permission from '../core/middleware/permission';
import validator from '../core/middleware/validator';
import { RoleTypes } from '../utils/constant';

const route = Router();
const topicController = new TopicController();

route.get('/', verifyUser, topicController.getAll);
route.post(
    '/',
    validator('topic-create'),
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    topicController.create,
);
route.get('/:id', verifyUser, topicController.getTopic);
route.put(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    topicController.update,
);
route.delete(
    '/:id',
    verifyUser,
    permission([RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN]),
    topicController.deleteTopic,
);
route.get('/own/:id', verifyUser, topicController.getTopicsByCreator);

export default route;
