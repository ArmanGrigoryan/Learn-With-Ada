import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';
import AnswerChoice from './answerChoice';

export interface IAssessment {
    id?: number;
    assessmentQuestion: string;
}

export class AssessmentData implements IAssessment {
    constructor(
        public id = 0,
        public assessmentQuestion = '',
        public answerChoices = [],
    ) {}
}

export default class Assessment extends Model implements IAssessment {
    id?: number;
    assessmentQuestion: string;
}

Assessment.init(
    {
        assessmentQuestion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        sequelize,
    },
);

Assessment.hasMany(AnswerChoice);
AnswerChoice.belongsTo(Assessment);
