import Lesson, { IAddLesson } from '../db/models/lesson';
import Instruction from '../db/models/instruction';
import Assessment from '../db/models/assessment';
import { NextFunction } from 'express';
import AnswerChoice from '../db/models/answerChoice';
import TopicLesson from '../db/models/topicLesson';
import Topic from '../db/models/topic';
import User from '../db/models/user';

export default class LessonService {
    public async getLessonById(
        id: number,
        next: NextFunction,
    ): Promise<Lesson | void> {
        try {
            const lesson = await Lesson.findByPk(id, {
                include: [
                    {
                        model: Assessment,
                        include: [
                            {
                                model: AnswerChoice,
                                attributes: ['answerChoice', 'isCorrect'],
                            },
                        ],
                    },
                    {
                        model: Instruction,
                    },
                    {
                        model: Topic,
                    },
                    {
                        model: User,
                    },
                ],
            });
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
            lesson.setDataValue(
                'topicId',
                lesson.getDataValue('Topics')?.[0]?.id,
            );
            return lesson;
        } catch (e) {
            return next(e);
        }
    }
    public async deleteLessonById(
        id: number,
        next: NextFunction,
    ): Promise<Lesson | void> {
        try {
            const deletedLesson = await Lesson.findByPk(id, {
                include: [
                    {
                        model: Assessment,
                        include: [
                            {
                                model: AnswerChoice,
                                attributes: ['answerChoice', 'isCorrect'],
                            },
                        ],
                    },
                    {
                        model: Instruction,
                    },
                    {
                        model: Topic,
                    },
                    {
                        model: User,
                    },
                ],
            });
            const assessments = await Assessment.findAll({
                where: {
                    LessonId: id,
                },
            });
            for (const assessment of assessments) {
                await AnswerChoice.destroy({
                    where: {
                        AssessmentId: assessment['id'],
                    },
                });
            }
            await Assessment.destroy({
                where: {
                    LessonId: id,
                },
            });
            await Instruction.destroy({
                where: {
                    LessonId: id,
                },
            });
            await Lesson.destroy({
                where: {
                    id,
                },
            });
            return deletedLesson;
        } catch (e) {
            return next(e);
        }
    }
    public async getCorrectAnswerByAssessmentQuestion(
        lessonId: number,
        next: NextFunction,
    ): Promise<[{ answerChoice: string; isCorrect: boolean }] | void> {
        try {
            const lesson = await this.getLessonById(lessonId, next);
            if (lesson) {
                const assessment = lesson
                    .getDataValue('assessment')
                    .map((item) => (item = item.getDataValue('answerChoices')));
                const answerChoices = assessment.flat();
                return answerChoices?.filter(
                    ({ isCorrect }) => isCorrect === true,
                );
            }
        } catch (e) {
            return next(e);
        }
    }

    public async getLessonsByTopicId(
        topicId: number,
        next: NextFunction,
    ): Promise<TopicLesson[] | void> {
        try {
            return TopicLesson.findAll({
                where: {
                    TopicId: topicId,
                },
                include: [
                    {
                        model: Assessment,
                        include: [
                            {
                                model: AnswerChoice,
                                attributes: ['answerChoice', 'isCorrect'],
                            },
                        ],
                    },
                    {
                        model: Instruction,
                    },
                    {
                        model: Topic,
                    },
                    {
                        model: User,
                    },
                ],
            });
        } catch (e) {
            return next(e);
        }
    }
    public async updateLessonById(
        id: number,
        { assessmentQuestion, answerChoices, instruction }: IAddLesson,
        next: NextFunction,
    ): Promise<Lesson | void> {
        try {
            instruction.instructionFile = `https://${process.env.BUCKET}.${process.env.DIGITAL_OCEAN_ENDPOINT}/${instruction.instructionFile}`;
            await Assessment.create(
                {
                    LessonId: id,
                    assessmentQuestion: assessmentQuestion,
                    AnswerChoices: [...answerChoices],
                },
                {
                    include: [
                        {
                            model: AnswerChoice,
                            attributes: ['answerChoice', 'isCorrect'],
                        },
                    ],
                },
            );
            await Instruction.create({
                LessonId: id,
                instructionType: 'text',
                instruction: instruction['instruction'],
                instructionFile: instruction?.instructionFile,
            });
            const lesson = await Lesson.findByPk(id, {
                include: [
                    {
                        model: Assessment,
                        include: [
                            {
                                model: AnswerChoice,
                                attributes: ['answerChoice', 'isCorrect'],
                            },
                        ],
                    },
                    {
                        model: Instruction,
                    },
                    {
                        model: Topic,
                    },
                    {
                        model: User,
                    },
                ],
            });
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
            lesson.setDataValue(
                'topicId',
                lesson.getDataValue('Topics')?.[0]?.id,
            );
            return lesson;
        } catch (e) {
            return next(e);
        }
    }

    public async getAll(next: NextFunction): Promise<Lesson[] | void> {
        try {
            const lessons = await Lesson.findAll({
                include: [
                    {
                        model: Assessment,
                        include: [
                            {
                                model: AnswerChoice,
                            },
                        ],
                    },
                    {
                        model: Topic,
                    },
                    {
                        model: Instruction,
                    },
                ],
            });
            for (const lesson of lessons as Lesson[]) {
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
                lesson.setDataValue(
                    'topicId',
                    lesson.getDataValue('Topics')?.[0]?.id,
                );
            }
            return lessons;
        } catch (e) {
            return next(e);
        }
    }

    public async getLessonsByUserId(
        userId: number,
        next: NextFunction,
    ): Promise<Lesson[] | void> {
        try {
            const lessons = await Lesson.findAll({
                where: {
                    createdByUserId: userId,
                },
                include: [
                    {
                        model: Assessment,
                        include: [
                            {
                                model: AnswerChoice,
                                attributes: ['answerChoice', 'isCorrect'],
                            },
                        ],
                    },
                    {
                        model: Instruction,
                    },
                    {
                        model: Topic,
                    },
                    {
                        model: User,
                    },
                ],
            });
            for (const lesson of lessons as Lesson[]) {
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
                lesson.setDataValue(
                    'topicId',
                    lesson.getDataValue('Topics')?.[0]?.id,
                );
            }
            return lessons;
        } catch (err) {
            return next(err);
        }
    }

    public async addNewLesson(
        {
            topicId,
            assessmentQuestion,
            answerChoices,
            instruction,
            createdByUserId,
        }: IAddLesson,
        next: NextFunction,
    ): Promise<Lesson | void> {
        try {
            instruction.instructionFile =
                instruction.instructionFile &&
                `https://${process.env.BUCKET}.${process.env.DIGITAL_OCEAN_ENDPOINT}/${instruction.instructionFile}`;
            const lesson = await Lesson.create(
                {
                    createdByUserId: createdByUserId,
                    Assessments: [
                        {
                            assessmentQuestion: assessmentQuestion,
                            AnswerChoices: [...answerChoices],
                        },
                    ],
                    Instructions: [
                        {
                            instructionType: 'text',
                            instruction: instruction.instruction,
                            instructionFile: instruction?.instructionFile,
                        },
                    ],
                },
                {
                    include: [
                        {
                            model: Assessment,
                            include: [
                                {
                                    model: AnswerChoice,
                                    attributes: ['answerChoice', 'isCorrect'],
                                },
                            ],
                        },
                        {
                            model: Instruction,
                        },
                        {
                            model: Topic,
                        },
                        {
                            model: User,
                        },
                    ],
                },
            );
            await TopicLesson.create({
                TopicId: topicId,
                LessonId: lesson['id'],
            });
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
            lesson.setDataValue('topicId', topicId);
            return lesson;
        } catch (e) {
            return next(e);
        }
    }
}
