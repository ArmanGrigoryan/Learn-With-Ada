import { sequelize } from '../config';
import { DataTypes, Model } from 'sequelize';

export interface IInstruction {
    id?: number;
    instructionType?: string;
    instruction: string;
    instructionFile?: string;
}

export default class Instruction extends Model implements IInstruction {
    id?: number;
    instructionType?: string;
    instruction: string;
    instructionFile?: string;
}

Instruction.init(
    {
        instructionType: {
            type: DataTypes.ENUM('text', 'video', 'slide'),
            defaultValue: 'text',
        },
        instruction: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructionFile: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        sequelize,
    },
);
