import { NextFunction } from 'express';
import AssessmentResult, {
    IAssessmentResult,
} from '../db/models/assessmentResult';
import LessonService from './lessonService';
const lessonService = new LessonService();
export default class AssessmentResultService {
    public async getAssessmentResultById(
        id: string,
        next: NextFunction,
    ): Promise<AssessmentResult | void> {
        try {
            return AssessmentResult.findByPk(id);
        } catch (e) {
            return next(e);
        }
    }

    public async deleteAssessmentResultById(
        id: string,
        next: NextFunction,
    ): Promise<number | void> {
        try {
            await AssessmentResult.destroy({
                where: { id },
            });
            return;
        } catch (e) {
            return next(e);
        }
    }

    public async getAssessmentResultsByUser(
        userId: string,
        next: NextFunction,
    ): Promise<AssessmentResult[] | void> {
        try {
            return AssessmentResult.findAll({ where: { userId } });
        } catch (e) {
            return next(e);
        }
    }
    public async getAll(
        next: NextFunction,
    ): Promise<AssessmentResult[] | void> {
        try {
            return AssessmentResult.findAll();
        } catch (e) {
            return next(e);
        }
    }

    public async addNewAssessmentResult(
        { userId, lessonId, score }: IAssessmentResult,
        next: NextFunction,
    ): Promise<AssessmentResult | void> {
        try {
            return AssessmentResult.create({
                userId,
                lessonId,
                score,
            });
        } catch (e) {
            return next(e);
        }
    }
    public async getAssessmentResultScore(
        lessonId: string,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        assessmentResult: any[],
        next: NextFunction,
    ): Promise<number | void> {
        try {
            let response = 0;
            for (const key in assessmentResult) {
                const corrects =
                    (await lessonService.getCorrectAnswerByAssessmentQuestion(
                        Number(lessonId),
                        next,
                    )) || [];
                if (
                    corrects.length === 1 &&
                    !Array.isArray(assessmentResult[key])
                ) {
                    assessmentResult[key] === corrects[0].answerChoice &&
                        response++;
                }
                if (
                    corrects.length > 1 &&
                    Array.isArray(assessmentResult[key])
                ) {
                    const answers = corrects.map(
                        ({ answerChoice }) => answerChoice,
                    );
                    const map = {};
                    answers.forEach((i) => (map[i] = false));
                    assessmentResult[key].forEach(
                        (i: string) => map[i] === false && (map[i] = true),
                    );
                    const isMatch = !Object.values(map).includes(false);
                    if (isMatch) {
                        response++;
                    }
                }
            }
            let score = 0;
            if (lessonId) {
                if (!isNaN(+response)) {
                    score = (+response * 100) / 1; // must be updated assessment.length, now we have only one assessment in lesson
                }
                return Math.trunc(score);
            }
        } catch (e) {
            return next(e);
        }
    }
}
