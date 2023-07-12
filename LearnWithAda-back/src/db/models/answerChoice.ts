import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';

export interface IAnswerChoice {
    answerChoice: string | boolean;
    isCorrect: boolean;
}

export default class AnswerChoice extends Model implements IAnswerChoice {
    answerChoice: string | boolean;
    isCorrect: boolean;
}

AnswerChoice.init(
    {
        answerChoice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        sequelize,
    },
);
