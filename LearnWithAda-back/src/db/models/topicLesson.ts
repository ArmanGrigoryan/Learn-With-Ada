import { sequelize } from '../config';
import { Model } from 'sequelize';
import Topic from './topic';
import Lesson from './lesson';

export default class TopicLesson extends Model {}
TopicLesson.init(
    {},
    {
        sequelize,
        freezeTableName: true,
    },
);
Topic.belongsToMany(Lesson, { through: 'TopicLesson' });
Lesson.belongsToMany(Topic, { through: 'TopicLesson' });
