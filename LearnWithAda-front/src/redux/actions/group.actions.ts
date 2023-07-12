import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';
import { GroupCreateData, UpdateGroupUserCourse } from '../../utils/interfaces';

export const createGroup = createAsyncThunk(
    'group/create',
    async ({
        name,
        creator,
        courseIds,
        userIds,
        businessId,
        navigateHome,
    }: GroupCreateData & { navigateHome: () => void }) => {
        const {
            data: { data },
        } = await axios.post('group', {
            name,
            creator,
            courseIds,
            userIds,
            businessId,
        });
        navigateHome();
        return data;
    },
);

export const updateGroup = createAsyncThunk(
    'group/update',
    async ({
        id,
        name,
        action,
        businessId,
        navigateHome,
    }: GroupCreateData & { navigateHome: () => void }) => {
        const {
            data: { data },
        } = await axios.put(`group/${id}`, {
            id,
            action,
            name,
            businessId,
        });
        navigateHome();
        return data;
    },
);

export const updateGroupUserCourse = createAsyncThunk(
    'group/update/user/course',
    async ({ id, action, courseId, userId }: UpdateGroupUserCourse) => {
        const {
            data: { data },
        } = await axios.put(`group/${id}`, {
            action,
            courseId,
            userId,
        });
        return data;
    },
);

export const deleteGroup = createAsyncThunk('group/delete', async (id: string) => {
    const {
        data: { data },
    } = await axios.delete('group', {
        data: { id },
    });
    return data;
});

export const getGroup = createAsyncThunk('group/get', async ({ id }: GroupCreateData) => {
    const {
        data: { data },
    } = await axios.get(`group/${id}`);
    return data;
});

export const getGroupAll = createAsyncThunk('group/getAll', async () => {
    const { data } = await axios.get('group');
    return data;
});

export const getGroupProgress = createAsyncThunk(
    'group/progress',
    async (id: Partial<GroupCreateData>) => {
        const { data } = await axios.get(`group/progress/${id}`);
        return data;
    },
);
