import { Model } from 'sequelize';
import { sequelize } from '../config';
import Course from './course';
import Group from './group';

export class GroupCourse extends Model {}

GroupCourse.init(
    {},
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
    },
);

Group.belongsToMany(Course, {
    through: 'GroupCourse',
    foreignKey: 'groupId',
});
Course.belongsToMany(Group, {
    through: 'GroupCourse',
    foreignKey: 'courseId',
});
