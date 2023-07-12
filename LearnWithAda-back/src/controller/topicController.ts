import Topic from '../services/topicService';
import Lesson from '../services/lessonService';
import { ApiResponse } from '../core/models/responseModel';
import type { NextFunction, Request, Response } from 'express';
import { RoleTypes } from '../utils/constant';
import { IAddLesson } from '../db/models/lesson';

const topicService = new Topic();
const lessonService = new Lesson();
export default class TopicController {
    public async getTopic(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            const topic = await topicService.getTopicById(Number(id), next);

            if (!topic) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Topic'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, topic, 'Topic data', false));
        } catch (error) {
            return next(error);
        }
    }

    public async deleteTopic(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const id = Number(req.params.id);
        try {
            const topic = await topicService.deleteTopicById(id, next);
            if (!topic) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Topic'));
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        topic,
                        'Topic deleted successfully',
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
            const { role, userId } = res.locals.user;
            const topics =
                role === RoleTypes.ADMIN
                    ? await topicService.getAll(next)
                    : await topicService.getTopicsByCreator(userId, next);
            if (!topics) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Topics'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, topics, 'Topics data', false));
        } catch (error) {
            return next(error);
        }
    }

    public async getTopicsByCreator(
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { userId } = res.locals.user;
            const topics = await topicService.getTopicsByCreator(+userId, next);
            if (!topics) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Topics'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, topics, 'Topics data', false));
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
            const { name, lessons } = req.body;
            if (!name) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const topic = await topicService.addNewTopic(
                {
                    name,
                    createdByUserId: userId,
                },
                next,
            );
            if (topic) {
                if (lessons && lessons.length) {
                    const newLessons = lessons.map(
                        async ({
                            instruction,
                            assessmentQuestion,
                            ...rest
                        }) => {
                            let choices = [];
                            if (
                                rest?.answerChoices &&
                                rest?.answerChoices?.length
                            ) {
                                choices = [...rest?.answerChoices];
                            } else if (
                                typeof rest?.simpleAnswer === 'boolean'
                            ) {
                                choices = [
                                    {
                                        answerChoice: true,
                                        isCorrect: rest?.simpleAnswer === true,
                                    },
                                    {
                                        answerChoice: false,
                                        isCorrect: rest?.simpleAnswer === false,
                                    },
                                ];
                            }
                            const lessonData = {
                                topicId: topic['id'],
                                assessmentQuestion,
                                answerChoices: choices,
                                instruction,
                                createdByUserId: userId,
                            };
                            const currLesson = await lessonService.addNewLesson(
                                lessonData,
                                next,
                            );
                            return currLesson;
                        },
                    );
                }
                const newTopic = await topicService.getTopicById(
                    topic['id'],
                    next,
                );
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            newTopic,
                            'Topic successfully saved',
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
            req.body = JSON.parse(JSON.stringify(req.body));
            const id = Number(req.params.id);
            const userId = Number(res.locals.user.userId);
            const { name } = req.body;
            const currTopic = await topicService.getTopicById(id, next);

            if (!name) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            if (!currTopic) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Topic'));
            }
            if (id) {
                await topicService.editTopic(id, name, next);
                if (req.body?.lessons && req.body?.lessons.length) {
                    const { lessons } = req.body;
                    const updatedLessons = lessons.map(
                        async ({ _id, ...lessonData }) => {
                            let choices = [];
                            if (
                                lessonData?.answerChoices &&
                                lessonData?.answerChoices?.length
                            ) {
                                choices = [...lessonData?.answerChoices];
                            } else if (
                                typeof lessonData?.simpleAnswer === 'boolean'
                            ) {
                                choices = [
                                    {
                                        answerChoice: true,
                                        isCorrect:
                                            lessonData?.simpleAnswer === true,
                                    },
                                    {
                                        answerChoice: false,
                                        isCorrect:
                                            lessonData?.simpleAnswer === false,
                                    },
                                ];
                            }
                            const { assessmentQuestion, instruction } =
                                lessonData;
                            if (instruction) {
                                return _id
                                    ? await lessonService.updateLessonById(
                                          _id,
                                          {
                                              assessmentQuestion,
                                              answerChoices: choices,
                                              instruction,
                                          } as IAddLesson,
                                          next,
                                      )
                                    : await lessonService.addNewLesson(
                                          {
                                              topicId: id,
                                              assessmentQuestion,
                                              answerChoices: choices,
                                              instruction,
                                              createdByUserId: userId,
                                          },
                                          next,
                                      );
                            }
                        },
                    );
                    if (updatedLessons) {
                        return res
                            .status(200)
                            .send(
                                new ApiResponse(
                                    200,
                                    null,
                                    'Topic with lessons successfully updated.',
                                    false,
                                ),
                            );
                    }
                }
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            null,
                            'Topic successfully updated',
                        ),
                    );
            }
        } catch (error) {
            return next(error);
        }
    }
}
