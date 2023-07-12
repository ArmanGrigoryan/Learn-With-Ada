import Jwt from '../services/jwtService';
import User from '../services/userService';
import { ApiResponse } from '../core/models/responseModel';
import type { NextFunction, Request, Response } from 'express';
import BusinessService from '../services/businessService';
import { UserData } from '../db/models/user';

const businessService = new BusinessService();
const userService = new User();
const jwtService = new Jwt();
export default class UserController {
    public async addUserPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { firstName, lastName, password, token } = req.body;
            const user = jwtService.verifyToken(token, process.env.INVITE_KEY);

            if (!user.userId || !firstName || !lastName || !password) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const data = await userService.addUserPassword(
                user.userId,
                firstName,
                lastName,
                user.email,
                password,
                next,
            );
            if (!data) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('User'));
            }
            data.newUser.setDataValue('token', data.token);
            await businessService.deleteUserToken(
                token,
                data.newUser['id'],
                next,
            );
            return res
                .status(200)
                .send(
                    new ApiResponse(
                        200,
                        data.newUser,
                        'User registered successfully.',
                        false,
                    ),
                );
        } catch (err) {
            return next(err);
        }
    }

    public async signIn(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { password, email } = req.body;
            if (!email || !password) {
                return res
                    .status(404)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const user = await userService.getUserByEmail(email, next);
            if (!user) {
                return res.send(
                    new ApiResponse(409, null, 'INVALID_PASSWORD_OR_EMAIL'),
                );
            }
            if (!user.validPassword(password)) {
                return res.send(
                    ApiResponse.generateLoginInvalidErrorResponse(),
                );
            }
            const result = new UserData(
                user['id'],
                user['firstName'],
                user['lastName'],
                user['email'],
                user['courses'],
                user['role'],
                jwtService.generateAccessToken(
                    user['id'],
                    user['email'],
                    user['role'],
                ),
            );
            return res
                .status(200)
                .send(
                    new ApiResponse(200, result, 'User successfully logged in'),
                );
        } catch (error) {
            return next(error);
        }
    }

    public async editUserRole(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!role) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            if (id) {
                const user = await userService.getUserById(
                    req,
                    Number(id),
                    next,
                );
                if (user) {
                    const updatedUser = await userService.updateUserById(
                        Number(id),
                        role,
                        next,
                    );
                    return res
                        .status(200)
                        .send(
                            new ApiResponse(
                                200,
                                updatedUser,
                                'User role updated successfully.',
                            ),
                        );
                }
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('User'));
            }
        } catch (err) {
            return next(err);
        }
    }

    public async signUp(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { password, firstName, lastName, email, role } = req.body;
            if (!firstName || !lastName || !email || !password || !role) {
                return res
                    .status(400)
                    .send(ApiResponse.generateBadRequestErrorResponse());
            }
            const possibleUser = await userService.getUserByEmail(email, next);
            if (possibleUser) {
                return res.send(new ApiResponse(409, null, 'EMAIL_EXISTS'));
            }
            const user = await userService.addNewUser(req.body, next);
            if (user) {
                const data = new UserData(
                    user['id'],
                    user['firstName'],
                    user['lastName'],
                    user['email'],
                    user['courses'],
                    user['role'],
                    jwtService.generateAccessToken(
                        user['id'],
                        user['email'],
                        user['role'],
                    ),
                );
                return res
                    .status(200)
                    .send(
                        new ApiResponse(200, data, 'User successfully saved'),
                    );
            }
        } catch (error) {
            return next(error);
        }
    }

    public async getUsers(
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const allUsers = (await userService.getAll(next)) as unknown[];
            if (!allUsers) {
                return res
                    .status(404)
                    .send(ApiResponse.generateNotFoundErrorResponse('Users'));
            }
            const users = allUsers.filter((each) => each['firstName'].trim());
            const data = (users as UserData[]).map(
                (item) =>
                    (item = new UserData(
                        item['id'],
                        item['firstName'],
                        item['lastName'],
                        item['email'],
                        item['Courses'],
                        item['role'],
                    )),
            );
            return res
                .status(200)
                .send(new ApiResponse(200, data, 'Users data'));
        } catch (error) {
            return next(error);
        }
    }

    public async getPassedLessons(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const { userId, courseId } = req.params;
            const response = await userService.getPassedLessons(
                Number(userId),
                Number(courseId),
                next,
            );
            if (response) {
                return res
                    .status(200)
                    .send(
                        new ApiResponse(200, response, 'Users passed lessons'),
                    );
            }
            return res
                .status(404)
                .send(
                    ApiResponse.generateNotFoundErrorResponse(
                        'Users or Courses',
                    ),
                );
        } catch (e) {
            next(e);
        }
    }
}
