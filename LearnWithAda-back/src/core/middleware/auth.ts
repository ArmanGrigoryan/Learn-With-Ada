import type { NextFunction, Response, Request } from 'express';
import Jwt from '../../services/jwtService';
import { ApiResponse } from '../models/responseModel';

const jwtService = new Jwt();

export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res
                .status(401)
                .send(ApiResponse.generateNotAuthorizedErrorResponse());
        }
        const bearer = authorizationHeader.split(' ');
        //Check if bearer is undefined
        if (
            bearer[0].toLowerCase() !== 'bearer' ||
            typeof bearer[1] === 'undefined'
        ) {
            return res
                .status(401)
                .send(ApiResponse.generateBearerInvalidErrorResponse());
        }
        const access_token = bearer[1];
        if (!access_token) {
            return res
                .status(403)
                .send(ApiResponse.generateNotAuthorizedErrorResponse());
        }
        const user = jwtService.verifyToken(access_token, process.env.JWT_KEY);
        req.headers['authorization'] = `Bearer ${access_token}`;

        user.token = access_token;
        res.locals.user = user;
        return next();
    } catch (error) {
        return res
            .status(401)
            .send(ApiResponse.generateNotAuthorizedErrorResponse());
    }
};
