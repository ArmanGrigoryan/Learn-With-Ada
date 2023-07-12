import { Router } from 'express';
import AssessmentResultController from '../controller/assessmentResultController';
import { verifyUser } from '../core/middleware/auth';
import validator from '../core/middleware/validator';

const route = Router();
const assessmentResultController = new AssessmentResultController();

route.get('/', assessmentResultController.getAll);
route.get('/:id', assessmentResultController.getAssessmentResult);
route.delete('/:id', assessmentResultController.deleteAssessmentResult);
route.post(
    '/',
    verifyUser,
    validator('assessmentResult-create'),
    assessmentResultController.create,
);
route.get(
    '/own/:userId',
    verifyUser,
    assessmentResultController.getAssessmentResultsByUser,
);

export default route;
