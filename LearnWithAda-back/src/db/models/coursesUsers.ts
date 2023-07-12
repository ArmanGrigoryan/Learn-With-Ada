import { sequelize } from '../config';
import { Model } from 'sequelize';
import Course from './course';
import User from './user';

export default class CourseUser extends Model {}
CourseUser.init(
    {},
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
    },
);
User.belongsToMany(Course, {
    through: 'CourseUser',
    foreignKey: 'userId',
});
Course.belongsToMany(User, {
    through: 'CourseUser',
    foreignKey: 'courseId',
});
