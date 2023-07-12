import { sequelize } from '../config';
import { Model } from 'sequelize';
import Course from './course';
import Topic from './topic';

export default class CourseTopic extends Model {}
CourseTopic.init(
    {},
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
    },
);

Course.belongsToMany(Topic, {
    through: 'CourseTopic',
    foreignKey: 'courseId',
});
Topic.belongsToMany(Course, {
    through: 'CourseTopic',
    foreignKey: 'topicId',
});
