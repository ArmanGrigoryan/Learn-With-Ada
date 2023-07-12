import Lesson from '../services/lessonService';
import { ApiResponse } from '../core/models/responseModel';
import type { NextFunction, Request, Response } from 'express';
import TopicService from '../services/topicService';
import { RoleTypes } from '../utils/constant';
import { IAddLesson } from '../db/models/lesson';
const lessonService = new Lesson();
const topicService = new TopicService();

export default class LessonController {
    public async getLesson(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { id } = req.params;
        try {
            const lesson = await lessonService.getLessonById(Number(id), next);
            if (!lesson) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Lesson'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, lesson, 'Lesson data', false));
        } catch (error) {
            return next(error);
        }
    }
    public async deleteLesson(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { id } = req.params;
        try {
            const lesson = await lessonService.deleteLessonById(
                Number(id),
                next,
            );
            if (!lesson) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Lesson'));
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        lesson,
                        'Lesson deleted successfully',
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
            const { userId, role } = res.locals.user;
            const lessons =
                role === RoleTypes.ADMIN
                    ? await lessonService.getAll(next)
                    : await lessonService.getLessonsByUserId(userId, next);
            if (!lessons) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Lessons'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, lessons, 'Lessons data', false));
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
            const { formData } = req.body;
            const {
                topicId,
                instruction,
                assessmentQuestion,
                answerChoices,
                simpleAnswer,
            } = JSON.parse(formData);

            if (
                !topicId ||
                !instruction ||
                !assessmentQuestion ||
                (!answerChoices && typeof simpleAnswer !== 'boolean')
            ) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const topic = await topicService.getTopicById(topicId, next);
            if (!topic) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Topic'));
            }
            let choices = [];
            if (answerChoices && answerChoices?.length) {
                choices = [...answerChoices];
            } else if (typeof simpleAnswer === 'boolean') {
                choices = [
                    {
                        answerChoice: true,
                        isCorrect: simpleAnswer === true,
                    },
                    {
                        answerChoice: false,
                        isCorrect: simpleAnswer === false,
                    },
                ];
            }
            const lesson = await lessonService.addNewLesson(
                {
                    topicId: topicId,
                    assessmentQuestion: assessmentQuestion,
                    answerChoices: choices,
                    instruction: instruction,
                    createdByUserId: userId,
                },
                next,
            );
            if (lesson) {
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            lesson,
                            'Lesson successfully saved',
                            false,
                        ),
                    );
            }
        } catch (error) {
            return next(error);
        }
    }
    public async update(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { formData } = req.body;
            const {
                topicId,
                instruction,
                assessmentQuestion,
                answerChoices,
                simpleAnswer,
            } = JSON.parse(formData);
            if (
                !topicId ||
                !instruction ||
                !assessmentQuestion ||
                (!answerChoices && typeof simpleAnswer !== 'boolean')
            ) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            let choices = [];
            if (answerChoices && answerChoices?.length) {
                choices = [...answerChoices];
            } else if (typeof simpleAnswer === 'boolean') {
                choices = [
                    {
                        answerChoice: true,
                        isCorrect: simpleAnswer === true,
                    },
                    {
                        answerChoice: false,
                        isCorrect: simpleAnswer === false,
                    },
                ];
            }
            const lesson = await lessonService.updateLessonById(
                Number(id),
                {
                    assessmentQuestion,
                    answerChoices: choices,
                    instruction,
                } as IAddLesson,
                next,
            );
            if (lesson) {
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            lesson,
                            'Lesson successfully updated',
                            false,
                        ),
                    );
            }
        } catch (error) {
            return next(error);
        }
    }
}
