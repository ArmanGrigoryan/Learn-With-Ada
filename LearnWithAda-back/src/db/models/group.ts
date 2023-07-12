import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';
import Business from './business';

export interface IGroup {
    id: number;
    name: string;
    creator: string;
    businessId: number;
}

export default class Group extends Model implements IGroup {
    id: number;
    name: string;
    creator: string;
    businessId: number;
}

Group.init(
    {
        creator: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'name',
                msg: 'The group name is already taken!',
            },
        },
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        sequelize,
    },
);
Business.hasMany(Group, {
    foreignKey: {
        name: 'businessId',
        allowNull: false,
    },
});
Group.belongsTo(Business, {
    foreignKey: {
        name: 'businessId',
        allowNull: false,
    },
});
