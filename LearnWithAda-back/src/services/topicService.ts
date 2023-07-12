import { NextFunction } from 'express';
import Topic, { ITopic } from '../db/models/topic';
import TopicLesson from '../db/models/topicLesson';
import Lesson from '../db/models/lesson';
import Instruction from '../db/models/instruction';
import Assessment from '../db/models/assessment';
import AnswerChoice from '../db/models/answerChoice';
import Course from '../db/models/course';

export default class TopicService {
    public async getAll(next: NextFunction): Promise<Topic[] | void> {
        try {
            const topics = await Topic.findAll({
                include: [
                    {
                        model: Lesson,
                        include: [
                            {
                                model: Instruction,
                            },
                            {
                                model: Assessment,
                                include: [
                                    {
                                        model: AnswerChoice,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: Course,
                    },
                ],
            });

            for (const topic of topics) {
                topic.setDataValue('lessons', topic.getDataValue('Lessons'));
                topic.setDataValue('Lessons', null);
                for (const lesson of topic.getDataValue('lessons')) {
                    lesson.setDataValue(
                        'assessment',
                        lesson.getDataValue('Assessments'),
                    );
                    lesson.setDataValue('Assessments', null);
                    lesson.setDataValue('TopicLesson', null);
                    for (const assessment of lesson.getDataValue(
                        'assessment',
                    )) {
                        assessment.setDataValue(
                            'answerChoices',
                            assessment.getDataValue('AnswerChoices'),
                        );
                        assessment.setDataValue('AnswerChoices', null);
                    }
                    lesson.setDataValue(
                        'instruction',
                        lesson.getDataValue('Instructions')[0],
                    );
                    lesson.setDataValue('Instructions', null);
                }
                topic.setDataValue(
                    'courseId',
                    topic.getDataValue('Courses')?.[0]?.id
                        ? topic.getDataValue('Courses')?.[0]?.id
                        : topic['courseId'],
                );
                topic.setDataValue('Courses', null);
            }
            return topics;
        } catch (e) {
            return next(e);
        }
    }

    public async getTopicById(
        id: number,
        next: NextFunction,
    ): Promise<Topic | void> {
        try {
            const topic = await Topic.findByPk(id, {
                include: [
                    {
                        model: Lesson,
                        include: [
                            {
                                model: Instruction,
                            },
                            {
                                model: Assessment,
                                include: [
                                    {
                                        model: AnswerChoice,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: Course,
                    },
                ],
            });

            topic.setDataValue('lessons', topic.getDataValue('Lessons'));
            topic.setDataValue('Lessons', null);
            for (const lesson of topic.getDataValue('lessons')) {
                lesson.setDataValue(
                    'assessment',
                    lesson.getDataValue('Assessments'),
                );
                lesson.setDataValue('Assessments', null);
                lesson.setDataValue('TopicLesson', null);
                for (const assessment of lesson.getDataValue('assessment')) {
                    assessment.setDataValue(
                        'answerChoices',
                        assessment.getDataValue('AnswerChoices'),
                    );
                    assessment.setDataValue('AnswerChoices', null);
                }
                lesson.setDataValue(
                    'instruction',
                    lesson.getDataValue('Instructions')[0],
                );
                lesson.setDataValue('Instructions', null);
            }
            topic.setDataValue(
                'courseId',
                topic.getDataValue('Courses')?.[0]?.id
                    ? topic.getDataValue('Courses')?.[0]?.id
                    : topic['courseId'],
            );
            topic.setDataValue('Courses', null);
            return topic;
        } catch (e) {
            return next(e);
        }
    }

    public async deleteTopicById(
        id: number,
        next: NextFunction,
    ): Promise<Topic | void> {
        try {
            const topic = await Topic.findByPk(id);
            await TopicLesson.destroy({
                where: {
                    TopicId: id,
                },
            });
            await Topic.destroy({
                where: {
                    id,
                },
            });
            return topic;
        } catch (e) {
            return next(e);
        }
    }

    public async getTopicByName(
        name: string,
        next: NextFunction,
    ): Promise<Topic | void> {
        try {
            const topic = await Topic.findOne({ where: { name } });

            topic.setDataValue('lessons', topic.getDataValue('Lessons'));
            topic.setDataValue('Lessons', null);
            for (const lesson of topic.getDataValue('lessons')) {
                lesson.setDataValue(
                    'assessment',
                    lesson.getDataValue('Assessments'),
                );
                lesson.setDataValue('Assessments', null);
                lesson.setDataValue('TopicLesson', null);
                for (const assessment of lesson.getDataValue('assessment')) {
                    assessment.setDataValue(
                        'answerChoices',
                        assessment.getDataValue('AnswerChoices'),
                    );
                    assessment.setDataValue('AnswerChoices', null);
                }
                lesson.setDataValue(
                    'instruction',
                    lesson.getDataValue('Instructions')[0],
                );
                lesson.setDataValue('Instructions', null);
            }
            topic.setDataValue('courseId', topic.getDataValue('Courses')[0].id);
            topic.setDataValue('Courses', null);
            return topic;
        } catch (e) {
            return next(e);
        }
    }

    public async getTopicsByCreator(
        createdByUserId: number,
        next: NextFunction,
    ): Promise<Topic[] | void> {
        try {
            const topics = await Topic.findAll({
                where: {
                    createdByUserId,
                },
                include: [
                    {
                        model: Lesson,
                        include: [
                            {
                                model: Instruction,
                            },
                            {
                                model: Assessment,
                                include: [
                                    {
                                        model: AnswerChoice,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            for (const topic of topics) {
                topic.setDataValue('lessons', topic.getDataValue('Lessons'));
                topic.setDataValue('Lessons', null);
                for (const lesson of topic.getDataValue('lessons')) {
                    lesson.setDataValue(
                        'assessment',
                        lesson.getDataValue('Assessments'),
                    );
                    lesson.setDataValue('Assessments', null);
                    lesson.setDataValue('TopicLesson', null);
                    for (const assessment of lesson.getDataValue(
                        'assessment',
                    )) {
                        assessment.setDataValue(
                            'answerChoices',
                            assessment.getDataValue('AnswerChoices'),
                        );
                        assessment.setDataValue('AnswerChoices', null);
                    }
                    lesson.setDataValue(
                        'instruction',
                        lesson.getDataValue('Instructions')[0],
                    );
                    lesson.setDataValue('Instructions', null);
                }
            }
            return topics;
        } catch (e) {
            return next(e);
        }
    }

    public async addNewTopic(
        { name, createdByUserId }: ITopic,
        next: NextFunction,
    ): Promise<Topic | void> {
        try {
            return Topic.create({
                name,
                createdByUserId,
            });
        } catch (e) {
            return next(e);
        }
    }

    public async editTopic(
        id: number,
        name: string,
        next: NextFunction,
    ): Promise<Topic | void> {
        try {
            await Topic.update(
                {
                    name,
                },
                {
                    where: { id },
                },
            );
            return Topic.findByPk(id);
        } catch (e) {
            return next(e);
        }
    }
}
