import jwt from 'jsonwebtoken';
import { IToken } from '../core/models/tokenModel';

export default class Jwt {
    public generateAccessToken(
        userId: number,
        email: string,
        role: string,
    ): string {
        try {
            return jwt.sign({ userId, email, role }, process.env.JWT_KEY, {
                expiresIn: process.env.ACCESS_TIME,
            });
        } catch (e) {
            return null;
        }
    }

    public generateInviteToken(email: string, userId: number): string {
        try {
            return jwt.sign({ userId, email }, process.env.INVITE_KEY, {
                expiresIn: '365d',
            });
        } catch (e) {
            return null;
        }
    }

    public verifyToken(token: string, key: string): IToken {
        try {
            return jwt.verify(token, key);
        } catch (error) {
            return null;
        }
    }
}
