import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import addFormats from 'ajv-formats';
import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import { ApiResponse } from '../models/responseModel';

const basename = path.basename(__filename);
const validator = new Ajv({
    allErrors: true,
    removeAdditional: 'all',
    $data: true,
});
addFormats(validator);
AjvErrors(validator);

fs.readdirSync('./src/validation')
    ?.filter((file: string) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-7) === '.v.json'
        );
    })
    .forEach((file: string) => {
        const schemaName = file.slice(0, -7);
        validator.addSchema(require('../../validation/' + file), schemaName);
    });

export default (schemaName: string) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const validationData = {
            body: req.body,
            query: req.query,
            params: req.params,
        };
        const isValid = validator.validate(schemaName, validationData);
        if (!isValid) {
            res.status(422).send(
                new ApiResponse(422, null, validator.errors[0].message),
            );
        } else {
            next();
        }
    };
