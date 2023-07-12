import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';
import Instruction, { IInstruction } from './instruction';
import User from './user';
import Assessment from './assessment';
import AnswerChoice from './answerChoice';

export interface ILesson {
    id?: number;
    instructionId: number[];
    assessmentId: number[];
    createdByUserId: number;
}

export interface IAddLesson {
    id?: number;
    topicId: number;
    assessmentQuestion?: string;
    answerChoices?: AnswerChoice[];
    instruction?: IInstruction;
    createdByUserId: number;
}

export default class Lesson extends Model implements ILesson {
    id?: number;
    instructionId: number[];
    assessmentId: number[];
    createdByUserId: number;
}
Lesson.init(
    {
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

Lesson.hasMany(Assessment);
Assessment.belongsTo(Lesson);

Lesson.hasMany(Instruction);
Instruction.belongsTo(Lesson);

User.hasMany(Lesson, {
    foreignKey: 'createdByUserId',
});
Lesson.belongsTo(User, {
    foreignKey: 'createdByUserId',
});
