import type { Application, NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../models/responseModel';

interface IErr {
    [key: string]: { [key: string]: string };
}

export interface ICustomError {
    message: string;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    data: any;
    error: boolean;
    messageName?: string;
    status: number;
    errors?: IErr;
}

// format errors in one style
const formatError = (err): ICustomError => {
    if (err?.name === 'SequelizeUniqueConstraintError') {
        return {
            ...ApiResponse.generateDuplicationErrorResponse(),
            message: err.message,
        };
    }
    return {
        message: err.message,
        status: err.status || 500,
        data: null,
        error: true,
    };
};

export default function (app: Application): void {
    // catch 404 and forward to error handler
    app.use((_req: Request, _res: Response, next: NextFunction) => {
        next(ApiResponse.generateNotFoundErrorResponse('Route'));
    });

    // error handler
    app.use(
        (
            err: ICustomError,
            _req: Request,
            res: Response,
            next: NextFunction,
        ) => {
            const error = formatError(err);
            let unexpectedError = false;
            // show errors for developers
            if (!error.status || error.status >= 500) {
                unexpectedError = true;
                /* eslint-disable no-alert, no-console */
                console.log('####################');
                console.log(err);
                console.log('####################');
            }
            if (unexpectedError) {
                res.status(500).json({
                    error: {
                        ...ApiResponse.generateDefaultErrorResponse(),
                        message: ApiResponse.generateDefaultErrorResponse(),
                        data: null,
                    },
                });
            } else {
                return res.status(error.status).json({ error });
            }
            next();
        },
    );
}
