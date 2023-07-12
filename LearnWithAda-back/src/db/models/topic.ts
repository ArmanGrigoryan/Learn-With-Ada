import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';
import User from './user';

export interface ITopic {
    id?: number;
    name: string;
    createdByUserId: number;
}

export default class Topic extends Model implements ITopic {
    id?: number;
    name: string;
    createdByUserId: number;
}

Topic.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'name',
                msg: 'The topic name is already taken!',
            },
        },
        createdByUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        sequelize,
    },
);

User.hasMany(Topic, {
    foreignKey: 'createdByUserId',
});
Topic.belongsTo(User, {
    foreignKey: 'createdByUserId',
});
