import AssessmentResult from '../services/assessmentResultService';
import { ApiResponse } from '../core/models/responseModel';
import type { NextFunction, Request, Response } from 'express';

const assessmentResult = new AssessmentResult();
export default class AssessmentResultController {
    public async getAssessmentResult(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { id } = req.params;
        try {
            const assessmentRes =
                await assessmentResult.getAssessmentResultById(id, next);
            if (!assessmentRes) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'AssessmentResult',
                        ),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        assessmentRes,
                        'AssessmentResult data',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }
    public async deleteAssessmentResult(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { id } = req.params;
        try {
            const assessmentRes =
                await assessmentResult.deleteAssessmentResultById(id, next);
            if (!assessmentRes) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'AssessmentResult',
                        ),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        assessmentRes,
                        'AssessmentResult data',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }

    public async getAll(
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const assessmentResults = await assessmentResult.getAll(next);
            if (!assessmentResults) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'AssessmentResult',
                        ),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        assessmentResults,
                        'AssessmentResults data',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }

    public async getAssessmentResultsByUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { userId } = req.params;
        try {
            const assessmentResults =
                await assessmentResult.getAssessmentResultsByUser(userId, next);
            if (!assessmentResults) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'AssessmentResults',
                        ),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        assessmentResults,
                        'AssessmentResults data',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }

    public async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { userId } = res.locals.user;
            const { lessonId, answerChoices } = req.body;
            if (!lessonId || !answerChoices) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const score = await assessmentResult.getAssessmentResultScore(
                lessonId,
                answerChoices,
                next,
            );
            const newAssessmentResult =
                await assessmentResult.addNewAssessmentResult(
                    {
                        ...req.body,
                        userId,
                        score,
                    },
                    next,
                );
            if (newAssessmentResult) {
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            newAssessmentResult,
                            'AssessmentResult saved successfully',
                        ),
                    );
            }
        } catch (error) {
            return next(error);
        }
    }
}
