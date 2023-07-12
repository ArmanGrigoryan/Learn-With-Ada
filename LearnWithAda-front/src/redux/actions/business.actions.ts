import { createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessCreateData } from '../../utils/interfaces';
import axios from '../axios';

export const createBusiness = createAsyncThunk(
    'business/create',
    async ({ name, navigateHome }: BusinessCreateData & { navigateHome: () => void }) => {
        const { data } = await axios.post('business', {
            name,
        });
        navigateHome();
        return { ...data.data };
    },
);

export const updateBusiness = createAsyncThunk(
    'business/update',
    async ({ id, name, navigateHome }: BusinessCreateData & { navigateHome: () => void }) => {
        const {
            data: { data },
        } = await axios.put('business', {
            id,
            name,
        });
        navigateHome();
        return data;
    },
);

export const deleteBusiness = createAsyncThunk('business/delete', async (id: string) => {
    const {
        data: { data },
    } = await axios.delete(`business/${id}`, {});
    return data;
});

export const getBusiness = createAsyncThunk('business/get', async ({ id }: BusinessCreateData) => {
    const {
        data: { data },
    } = await axios.get(`business/${id}`);
    return data;
});

export const getBusinessAll = createAsyncThunk('business/getAll', async () => {
    const { data } = await axios.get('business');
    return data;
});

export const changeBusinessMemberStatus = createAsyncThunk(
    'business/change-member-status',
    async ({
        businessId,
        memberId,
        status,
    }: {
        businessId: string;
        memberId: string;
        status: string;
    }) => {
        const {
            data: { data },
        } = await axios.put('business/change-status', {
            businessId,
            userId: memberId,
            status,
        });
        return { ...data, id: memberId, businessId };
    },
);

export const addBusinessMemberToCourse = createAsyncThunk(
    'business/add-member-to-course',
    async ({ memberId, courseId }: { memberId: string; courseId: string }) => {
        const {
            data: { data },
        } = await axios.put(`course/${courseId}`, {
            userIds: memberId,
            action: 'add',
        });
        return data;
    },
);
