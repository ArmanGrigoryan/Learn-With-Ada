import Assessment, { AssessmentData } from '../db/models/assessment';
import { NextFunction } from 'express';
import AnswerChoice from '../db/models/answerChoice';

export default class AssessmentService {
    public async getAssessmentById(
        id: number,
        next: NextFunction,
    ): Promise<Assessment | void> {
        try {
            return Assessment.findByPk(id, { include: AnswerChoice });
        } catch (e) {
            return next(e);
        }
    }

    public async deleteAssessmentById(
        id: number,
        next: NextFunction,
    ): Promise<Assessment | void> {
        try {
            const assessment = await Assessment.findByPk(id);
            await Assessment.destroy({ where: { id } });
            await AnswerChoice.destroy({
                where: {
                    assessmentId: id,
                },
            });
            return assessment;
        } catch (e) {
            return next(e);
        }
    }

    public async updateAssessmentById(
        id: number,
        assessmentData: AssessmentData,
        next: NextFunction,
    ): Promise<AssessmentData | void> {
        try {
            const { answerChoices, assessmentQuestion } = assessmentData;
            await Assessment.update(
                {
                    assessmentQuestion,
                },
                {
                    where: { id },
                },
            );
            for (const answerChoiceElement of answerChoices) {
                await AnswerChoice.update(
                    {
                        answerChoice: answerChoiceElement.answerChoice,
                        isCorrect: answerChoiceElement.isCorrect,
                    },
                    {
                        where: {
                            assessmentId: id,
                        },
                    },
                );
            }
            return assessmentData;
        } catch (e) {
            return next(e);
        }
    }

    public async addNewAssessment(
        { assessmentQuestion, answerChoices }: AssessmentData,
        next: NextFunction,
    ): Promise<Assessment | void> {
        try {
            const assessment = await Assessment.create({
                assessmentQuestion,
            });
            for (const answerChoicesElement of answerChoices) {
                await AnswerChoice.create({
                    answerChoice: answerChoicesElement.answerChoice,
                    isCorrect: answerChoicesElement.isCorrect,
                    assessmentId: assessment['id'],
                });
            }
            return assessment;
        } catch (e) {
            return next(e);
        }
    }
}
