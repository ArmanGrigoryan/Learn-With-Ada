import { RoleTypes } from '../../utils/constant';

export interface IToken {
    userId: number;
    email: string;
    role: RoleTypes;
    token?: string;
    iat: number;
    exp: number;
}
