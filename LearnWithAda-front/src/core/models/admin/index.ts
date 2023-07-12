import { UserInterface } from '../user';

export enum AdminDataKeys {
    USERS = 'users',
    REVALIDATE = 'revalidate',
    LOADING = 'loading',
}

export interface AdminData {
    [AdminDataKeys.USERS]: UserInterface[];
    [AdminDataKeys.REVALIDATE]: boolean;
    [AdminDataKeys.LOADING]: boolean;
}
