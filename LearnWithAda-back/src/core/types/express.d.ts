// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';
declare module 'express' {
    interface Request {
        io;
    }
}
