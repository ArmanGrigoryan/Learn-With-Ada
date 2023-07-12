import { DataTypes, Model } from 'sequelize';
import { MemberStatus } from '../../utils/constant';
import { sequelize } from '../config';
import Business from './business';
import User from './user';

export interface IMember {
    userId: number;
    token: string;
    status: MemberStatus;
}

export class BusinessMember extends Model implements IMember {
    userId: number;
    token: string | null;
    status: MemberStatus;
}

BusinessMember.init(
    {
        status: {
            type: DataTypes.ENUM('invited', 'active', 'inactive'),
            defaultValue: 'invited',
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
    },
);

User.belongsToMany(Business, {
    through: 'BusinessMember',
    foreignKey: 'userId',
});

Business.belongsToMany(User, {
    through: 'BusinessMember',
    foreignKey: 'businessId',
});
