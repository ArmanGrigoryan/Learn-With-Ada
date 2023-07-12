import { GroupCreateData, BusinessMembers } from '../../../utils/interfaces';

export enum BusinessDataKeys {
    ID = 'id',
    NAME = 'name',
    CREATOR = 'creator',
    GROUP_IDS = 'groupIds',
    MEMBERS = 'members',
}

export interface BusinessData {
    [BusinessDataKeys.NAME]: string;
    [BusinessDataKeys.ID]: string;
    [BusinessDataKeys.CREATOR]: string;
    [BusinessDataKeys.GROUP_IDS]: Array<GroupCreateData>;
    [BusinessDataKeys.MEMBERS]: Array<BusinessMembers>;
}
