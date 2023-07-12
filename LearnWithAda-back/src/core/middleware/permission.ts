import type { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../models/responseModel';

export default function (roles: Array<string>) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const role = res.locals.user.role as string;
        if (roles.includes(role)) {
            return next();
        }
        next({
            ...ApiResponse.generatePermissionDeniedErrorResponse(),
        });
    };
}
