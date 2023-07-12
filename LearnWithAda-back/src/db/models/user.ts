import { sequelize } from '../config';
import { CourseData } from './course';
import { DataTypes, Model } from 'sequelize';
import crypto from 'crypto';

const salt = process.env.SALT;

export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    courses: string[] | (CourseData[] & string[]);
    role: string;
    validPassword?: (pass: string) => boolean;
}

export class UserData implements IUser {
    constructor(
        public id = 0,
        public firstName = '',
        public lastName = '',
        public email = '',
        public courses = [],
        public role = '',
        public token = '',
    ) {}
}

class User extends Model implements IUser {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    courses: string[] | (CourseData[] & string[]);
    role: string;
    validPassword: (password: string) => boolean;
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            unique: {
                name: 'email',
                msg: 'The email is already taken!',
            },
        },
        password: {
            type: DataTypes.STRING,
            set(value: string) {
                this.setDataValue(
                    'password',
                    crypto
                        .pbkdf2Sync(value, salt, 1000, 64, `sha512`)
                        .toString(`hex`),
                );
            },
        },
        role: {
            type: DataTypes.ENUM('user', 'admin', 'business-admin'),
            defaultValue: 'user',
        },
    },
    {
        freezeTableName: true,
        sequelize,
    },
);

User.prototype.validPassword = function (password: string): boolean {
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return this.password === hash;
};

export default User;
