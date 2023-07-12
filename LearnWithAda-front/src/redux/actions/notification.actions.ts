import { NotificationData } from '../../core/models/notification';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const addNotification = createAsyncThunk(
    'notification/add',
    async ({
        navigateHome,
        ...notification
    }: Omit<NotificationData, 'id'> & { navigateHome: () => void }) => {
        const {
            data: { data },
        } = await axios.post('notification', notification);
        navigateHome();
        return {
            data,
        };
    },
);

export const editNotification = createAsyncThunk('notification/edit', async (ids: string[]) => {
    const {
        data: { data },
    } = await axios.put(`notification`, { ids });
    return {
        data,
    };
});

export const getNotifications = createAsyncThunk(
    'notification/get',
    async (params?: { skip?: number; isNew?: string }) => {
        const {
            data: { data },
        } = await axios.get(
            `notification/own?skip=${params?.skip || 0} ${
                params?.isNew ? `&isNew=${params?.isNew}` : ''
            }`,
        );
        return {
            data,
        };
    },
);

export const getNewNotifications = createAsyncThunk(
    'notification/get-new',
    async (params?: { skip?: number }) => {
        const {
            data: { data },
        } = await axios.get(`notification/own?skip=${params?.skip || 0}`);
        return {
            data,
        };
    },
);
