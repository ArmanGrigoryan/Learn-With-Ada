import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compress from 'compression';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import UserApi from './api/user.api';
import GroupApi from './api/group.api';
import BusinessApi from './api/business.api';
import LessonApi from './api/lesson.api';
import CourseApi from './api/course.api';
import TopicApi from './api/topic.api';
import type { NextFunction, Request, Response } from 'express';
import NotificationApi from './api/notification.api';
import AssessmentResultApi from './api/assessmentResult.api';
import connect from './db/config';
import { sequelize } from './db/config';

dotenv.config({ path: './envs/.env' });
import errorHandler from './core/errorHandler/errorHandler';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_HOST,
        methods: ['GET', 'POST'],
    },
});

app.use((req: Request & { io: Server }, _res: Response, next: NextFunction) => {
    req.io = io;
    return next();
});
app.use(express.json());
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 1000000,
    }),
);
app.set('showStackError', true);
app.use(compress());
app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        exposedHeaders: 'new',
    }),
);
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type',
    );
    res.setHeader('new', '');
    next();
});
connect()
    .then(() => console.log('Connected to DB!'))
    .catch((err) => console.log(err));
sequelize
    .sync()
    .then(() => console.log('Models defined'))
    .catch((err) => console.log('Sync ERROR!!! ' + err));

app.use('/user', UserApi);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/topic', TopicApi);
app.use('/business', BusinessApi);
app.use('/group', GroupApi);
app.use('/lesson', LessonApi);
app.use('/assessmentResult', AssessmentResultApi);
app.use('/course', CourseApi);
app.use('/notification', NotificationApi);
app.use('/file/logo/', express.static(path.join(__dirname, '/uploads/logo')));
app.use('/file/media/', express.static(path.join(__dirname, '/uploads/video')));
errorHandler(app);
const port = process.env.PORT || 8000;
server.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
