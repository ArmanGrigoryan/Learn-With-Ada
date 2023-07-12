import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';
import User from './user';

export default class Business extends Model {}

Business.init(
    {
        name: {
            type: DataTypes.STRING,
            unique: {
                name: 'name',
                msg: 'The business name is already taken!',
            },
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        sequelize,
    },
);

User.hasMany(Business, {
    foreignKey: {
        name: 'creator',
        allowNull: false,
    },
});

Business.belongsTo(User, {
    foreignKey: {
        name: 'creator',
        allowNull: false,
    },
});
