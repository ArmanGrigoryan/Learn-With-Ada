import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';

export interface INotification {
    id?: number;
    businessAdminId: number;
    userId: number;
    courseId: number;
    seen: boolean;
    text: string;
    date: string;
}

export default class Notification extends Model implements INotification {
    id?: number;
    businessAdminId: number;
    userId: number;
    courseId: number;
    seen: boolean;
    text: string;
    date: string;
}

Notification.init(
    {
        businessAdminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        seen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        text: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        sequelize,
    },
);
