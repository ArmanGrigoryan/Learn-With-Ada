import Instruction, { IInstruction } from '../db/models/instruction';
import { NextFunction } from 'express';

export default class InstructionService {
    public async getInstructionById(
        id: string,
        next: NextFunction,
    ): Promise<Instruction | void> {
        try {
            return Instruction.findByPk(id);
        } catch (e) {
            return next(e);
        }
    }

    public async updateInstructionById(
        id: string,
        instructionData: IInstruction,
        next: NextFunction,
    ): Promise<Instruction | void> {
        try {
            await Instruction.update(
                {
                    instructionData,
                },
                {
                    where: { id },
                },
            );
            return Instruction.findByPk(id);
        } catch (e) {
            return next(e);
        }
    }

    public async getInstruction(
        inst: string,
        next: NextFunction,
    ): Promise<Instruction | void> {
        try {
            return Instruction.findOne({
                where: {
                    instruction: inst,
                },
            });
        } catch (e) {
            return next(e);
        }
    }

    public async addNewInstruction(
        { instruction, instructionType = 'text' }: IInstruction,
        next: NextFunction,
    ): Promise<Instruction | void> {
        try {
            return Instruction.create({
                instructionType,
                instruction,
            });
        } catch (e) {
            return next(e);
        }
    }

    public async deleteInstructionById(
        id: string,
        next: NextFunction,
    ): Promise<Instruction | void> {
        try {
            const instruction = await Instruction.findByPk(id);
            await Instruction.destroy({ where: { id } });
            return instruction;
        } catch (e) {
            return next(e);
        }
    }
}
