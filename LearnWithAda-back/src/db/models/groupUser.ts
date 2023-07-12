import { Model } from 'sequelize';
import { sequelize } from '../config';
import Group from './group';
import User from './user';

export class GroupUser extends Model {}

GroupUser.init(
    {},
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
    },
);

Group.belongsToMany(User, {
    through: 'GroupUser',
    foreignKey: 'groupId',
});
User.belongsToMany(Group, {
    through: 'GroupUser',
    foreignKey: 'userId',
});
