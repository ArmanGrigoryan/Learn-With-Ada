import { NextFunction, Response, Request } from 'express';
import BusinessService from '../services/businessService';
import { ApiResponse } from '../core/models/responseModel';
import UserService from '../services/userService';
import { RoleTypes } from '../utils/constant';
import Jwt from '../services/jwtService';

const jwtService = new Jwt();
const businessService = new BusinessService();
const userService = new UserService();
export default class BusinessController {
    public async changeUserStatus(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const user = res.locals.user;
            const { businessId, userId, status } = req.body;
            if (!businessId || !userId || !status) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const businessAdmin = await businessService.getBusinessAdmin(
                businessId,
                next,
            );
            const data = await businessService.changeUserStatus(
                businessId,
                userId,
                status,
                next,
            );
            if (
                (businessAdmin &&
                    businessAdmin != user.userId &&
                    user.role == RoleTypes.BUSINESS_ADMIN) ||
                (user.role != RoleTypes.ADMIN && !businessAdmin) ||
                !data
            ) {
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
                        'User status changed successfully.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }

    public async getUserBusinessesById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const data = await businessService.getUserBusinessesById(
                Number(userId),
                next,
            );
            if (!data) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse(
                            'User on Business',
                        ),
                    );
            }
            return res
                .status(200)
                .send(new ApiResponse(200, data, 'Users businesses.', false));
        } catch (err) {
            return next(err);
        }
    }

    public async updateName(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { userId, role } = res.locals.user;
            const { id, name } = req.body;
            if (!id || !name) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const businessAdmin = await businessService.getBusinessAdmin(
                id,
                next,
            );

            if (
                (businessAdmin &&
                    businessAdmin !== userId &&
                    role === RoleTypes.BUSINESS_ADMIN) ||
                (role !== RoleTypes.ADMIN && !businessAdmin)
            ) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const data = await businessService.updateNameById(id, name, next);
            if (!data) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse('Business'),
                    );
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        data,
                        'Business name updated successfully.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }

    public async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { role, userId } = res.locals.user;
            const data =
                role === RoleTypes.ADMIN.toString()
                    ? ((await businessService.getAll(next)) as unknown)
                    : ((await businessService.getAll(
                          next,
                          Number(userId),
                      )) as unknown);
            for (const item of data['businesses']) {
                item.dataValues.members = [];
                for (const elem of data['members']) {
                    if (elem[0]?.businessId == item.id) {
                        item.dataValues.members.push(elem);
                    }
                }
                item.dataValues.members = item.dataValues.members[0];
            }
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        data['businesses'],
                        'Business data.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }

    public async inviteUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        const { businessId, email } = req.body;
        const { userId, role } = res.locals.user;

        if (!businessId || !email) {
            return res
                .status(400)
                .send(ApiResponse.generateBadRequestErrorResponse());
        }
        const businessAdmin = await businessService.getBusinessAdmin(
            Number(businessId),
            next,
        );
        if (
            (businessAdmin &&
                businessAdmin !== userId &&
                role === RoleTypes.BUSINESS_ADMIN) ||
            (role !== RoleTypes.ADMIN && !businessAdmin)
        ) {
            return res
                .status(400)
                .send(ApiResponse.generateBadRequestErrorResponse());
        }

        const data = await businessService.inviteUser(email, businessId, next);
        const message = data
            ? 'User invitation sent successfully.'
            : 'User already exists.';
        return res.status(200).send(new ApiResponse(200, data, message, false));
    }

    public async createBusiness(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { name } = req.body;
            const { userId } = res.locals.user;
            if (!name || !userId) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const user = await userService.getUserById(
                req,
                Number(userId),
                next,
            );
            if (!user) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Creator'));
            }
            const data = await businessService.createBusiness(
                name,
                Number(userId),
                next,
            );
            if (user['role'] === RoleTypes.USER) {
                await userService.updateUserById(
                    user['id'],
                    RoleTypes.BUSINESS_ADMIN,
                    next,
                );
                const token = jwtService.generateAccessToken(
                    user['id'],
                    user['email'],
                    RoleTypes.BUSINESS_ADMIN,
                );
                return res.status(201).send(
                    new ApiResponse(
                        201,
                        {
                            data: data,
                            token: token,
                        },
                        'Business created successfully.',
                        false,
                    ),
                );
            }
            return res
                .status(201)
                .send(
                    new ApiResponse(
                        201,
                        data,
                        'Business created successfully.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }

    public async getBusinessById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { role, userId } = res.locals.user;
            const { id } = req.params;

            if (!id) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const data = await businessService.getBusinessById(
                Number(id),
                next,
            );

            if (!data) {
                return res
                    .status(404)
                    .send(
                        ApiResponse.generateNotFoundErrorResponse('Business'),
                    );
            }
            if (
                role === RoleTypes.BUSINESS_ADMIN.toString() &&
                data['creator'] !== userId
            ) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            return res
                .status(200)
                .send(new ApiResponse(200, data, 'Data of business.', false));
        } catch (err) {
            return next(err);
        }
    }

    public async deleteBusiness(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { userId, role } = res.locals.user;
            const { id } = req.params;
            if (!id) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }

            const businessAdmin = await businessService.getBusinessAdmin(
                Number(id),
                next,
            );
            if (
                !(
                    businessAdmin &&
                    businessAdmin !== userId &&
                    role === RoleTypes.BUSINESS_ADMIN
                ) &&
                !(role !== RoleTypes.ADMIN && !businessAdmin)
            ) {
                const data = await businessService.deleteBusinessById(
                    Number(id),
                    next,
                );
                if (!data) {
                    return res
                        .status(404)
                        .send(
                            ApiResponse.generateNotFoundErrorResponse(
                                'Business',
                            ),
                        );
                }
                return res
                    .status(200)
                    .send(
                        new ApiResponse(
                            200,
                            data,
                            'Business deleted successfully.',
                            false,
                        ),
                    );
            }
            return res
                .status(400)
                .send(ApiResponse.generateBadRequestErrorResponse());
        } catch (err) {
            return next(err);
        }
    }
}
