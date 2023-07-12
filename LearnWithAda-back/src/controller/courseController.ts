import Course from '../services/courseService';
import { ApiResponse } from '../core/models/responseModel';
import type { NextFunction, Request, Response } from 'express';

const course = new Course();
export default class CourseController {
    public async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const user = res.locals.user;
        try {
            const courses = await course.getAll(req, user, next);
            if (!courses) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Courses'));
            }
            res.status(200).send(
                new ApiResponse(200, courses, 'Courses data', false),
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
            const { name, price, description, logo, currentPrice } = req.body;
            const userId = Number(res.locals.user.userId);
            let logoExt;
            if (logo) {
                logoExt = logo.split('.');
                logoExt = logoExt[logoExt.length - 1];
            }
            if (!name || !price || !description) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            } else if (
                logoExt !== 'png' &&
                logoExt !== 'jpg' &&
                logoExt !== 'jpeg' &&
                logoExt
            ) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            } else if (isNaN(+price) || isNaN(+currentPrice)) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            } else {
                req.body.visibility = req.body?.visibility
                    ? req.body.visibility
                    : 'public';
                req.body.logo = req.body.logo
                    ? `https://${process.env.BUCKET}.${process.env.DIGITAL_OCEAN_ENDPOINT}/${req.body.logo}`
                    : `https://${process.env.BUCKET}.${process.env.DIGITAL_OCEAN_ENDPOINT}/default.png`;
                const newCourse = await course.addNewCourse(
                    userId,
                    req.body,
                    next,
                );
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            newCourse,
                            'Course was created successfully',
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
            const { userId } = res.locals.user;
            const { userIds } = req.body;
            const { topicIds } = req.body;
            const { price, currentPrice } = req.body;

            req.body.userId = Number(userIds);
            req.body.topicId = Number(topicIds);

            if (price && (isNaN(+price) || isNaN(+currentPrice))) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            if (req.body.logo) {
                req.body.logo = `https://${process.env.BUCKET}.${process.env.DIGITAL_OCEAN_ENDPOINT}/${req.body.logo}`;
            }
            const updatedCourse = await course.update(
                Number(id),
                req.body,
                userId,
                next,
            );
            if (!updatedCourse) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        updatedCourse,
                        'Course was updated successfully',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }

    public async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            const deletedCourse = await course.deleteCourseById(
                Number(id),
                next,
            );
            if (!deletedCourse) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Course'));
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        null,
                        'Course was deleted successfully',
                        false,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    }
}
