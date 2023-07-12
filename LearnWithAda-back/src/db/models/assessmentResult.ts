import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';

export interface IAssessmentResult {
    id?: string;
    userId: string;
    lessonId: string;
    score: number;
}

export default class AssessmentResult
    extends Model
    implements IAssessmentResult
{
    id?: string;
    userId: string;
    lessonId: string;
    score: number;
}

AssessmentResult.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lessonId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        score: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        sequelize,
    },
);
