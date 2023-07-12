import { NextFunction, Response, Request } from 'express';
import GroupService from '../services/groupService';
import { ApiResponse } from '../core/models/responseModel';
import BusinessService from '../services/businessService';
import { MemberStatus } from '../utils/constant';

const businessService = new BusinessService();
const groupService = new GroupService();
export default class GroupController {
    public async getGroupProgress(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            const group = await groupService.getGroupById(Number(id), next);
            if (!id || !group) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Group'));
            }
            const data = await groupService.getGroupProgress(Number(id), next);
            if (!data) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        data,
                        'Progress of current Group.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }
    public async updateGroup(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { name, action, userId, courseId } = req.body;
            if (!id || !action) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            if (userId) {
                const validUser = await businessService.getUserBusinessesById(
                    userId,
                    next,
                );
                if (!validUser || validUser['length'] === 0) {
                    return res
                        .status(400)
                        .send(ApiResponse.generateBadRequestErrorResponse());
                }
                const verify = validUser['members'].find((item) => {
                    return (
                        item.userId === Number(userId) &&
                        item.status === MemberStatus.INVITED
                    );
                });
                if (verify) {
                    return res
                        .status(400)
                        .send(ApiResponse.generateBadRequestErrorResponse());
                }
            }
            const data = await groupService.updateGroup(
                Number(id),
                name ? name : '',
                userId ? userId : 0,
                courseId ? courseId : 0,
                action,
                next,
            );
            if (!data) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Group'));
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        data,
                        'Group updated successfully',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }
    public async createGroup(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const creator = req.body.creator ? req.body.creator : null;
            const name = req.body.name ? req.body.name : null;
            const businessId = req.body.businessId ? req.body.businessId : null;
            const courseIds = req.body.courseIds ? req.body.courseIds : [];
            const userIds = req.body.userIds ? req.body.userIds : [];
            if (!name || !businessId || !creator) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const data = await groupService.createGroup(
                name,
                creator,
                businessId,
                userIds,
                courseIds,
                next,
            );
            if (!data) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            return res
                .status(201)
                .send(
                    new ApiResponse(
                        201,
                        data,
                        'Group created successfully.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }
    public async getGroup(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const data = await groupService.getGroupById(Number(id), next);

            if (!data) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Group'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, data, null, false));
        } catch (err) {
            return next(err);
        }
    }
    public async getAllGroups(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const data = await groupService.getAll(next);
            if (!data) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Group'));
            }
            return res
                .status(200)
                .send(new ApiResponse(200, data, 'All groups data', false));
        } catch (err) {
            return next(err);
        }
    }
    public async deleteGroup(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { id } = req.body;
        if (!id) {
            return res
                .status(400)
                .send(ApiResponse.generateBadRequestErrorResponse());
        }
        const data = await groupService.deleteGroupById(id, next);
        if (!data) {
            return res
                .status(404)
                .send(ApiResponse.generateNotFoundErrorResponse('Group'));
        }
        return res
            .status(200)
            .send(
                new ApiResponse(
                    200,
                    data,
                    'Group deleted successfully.',
                    false,
                ),
            );
    }
}
