import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';
import User from './user';
import { CourseVisibility } from '../../utils/constant';

export interface ICourse {
    id?: string;
    name?: string;
    totalLessons: number;
    createdByUserId: string;
    visibility: CourseVisibility;
    price: string;
    currentPrice: string;
    description: string;
    logo: string;
}

export class CourseData implements ICourse {
    constructor(
        public id = '',
        public name = '',
        public userIds = [],
        public topicIds = [],
        public totalLessons = 0,
        public createdByUserId = '',
        public visibility = CourseVisibility.PUBLIC,
        public price = '',
        public currentPrice = '',
        public description = '',
        public logo = '',
    ) {}
}

class Course extends Model implements ICourse {
    id?: string;
    name?: string;
    totalLessons: number;
    createdByUserId: string;
    visibility: CourseVisibility;
    price: string;
    currentPrice: string;
    description: string;
    logo: string;
}

Course.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'name',
                msg: 'The course name is already taken!',
            },
        },
        totalLessons: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        visibility: {
            type: DataTypes.ENUM('public', 'private'),
            allowNull: false,
            defaultValue: 'public',
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currentPrice: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            defaultValue: 'default.png',
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        sequelize,
    },
);

Course.belongsTo(User, {
    foreignKey: 'createdByUserId',
});

User.hasMany(Course, {
    foreignKey: 'createdByUserId',
});

export default Course;
